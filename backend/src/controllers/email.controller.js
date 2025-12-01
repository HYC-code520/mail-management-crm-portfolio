const { sendTemplateEmail, sendEmail } = require('../services/email.service');
const { supabase } = require('../services/supabase.service');

/**
 * Send email notification using a template and log it
 * POST /api/emails/send
 * Body: { contact_id, mail_item_id?, template_id, message_type?, custom_variables? }
 */
async function sendNotificationEmail(req, res, next) {
  try {
    const {
      contact_id,
      mail_item_id,
      template_id,
      message_type,
      custom_variables
    } = req.body;

    // Validation
    if (!contact_id || !template_id) {
      return res.status(400).json({ 
        error: 'contact_id and template_id are required' 
      });
    }

    // 1. Get contact info
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('email, name, mailbox_number, preferred_language')
      .eq('contact_id', contact_id)
      .single();

    if (contactError || !contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    if (!contact.email) {
      return res.status(400).json({ error: 'Contact has no email address' });
    }

    // 2. Get template
    const { data: template, error: templateError } = await supabase
      .from('message_templates')
      .select('*')
      .eq('template_id', template_id)
      .single();

    if (templateError || !template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // 3. Get mail item details if provided
    let mailItemDetails = {};
    if (mail_item_id) {
      const { data: mailItem } = await supabase
        .from('mail_items')
        .select('*')
        .eq('mail_item_id', mail_item_id)
        .single();
      
      if (mailItem) {
        mailItemDetails = {
          MAIL_TYPE: mailItem.item_type || '',
          TRACKING_NUMBER: mailItem.tracking_number || '',
          RECEIVED_DATE: new Date(mailItem.received_date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          QUANTITY: mailItem.quantity || 1,
          STATUS: mailItem.status || ''
        };
      }
    }

    // 4. Build variables for template substitution
    const variables = {
      CUSTOMER_NAME: contact.name || 'Customer',
      MAILBOX_NUMBER: contact.mailbox_number || '',
      CONTACT_EMAIL: contact.email || '',
      ...mailItemDetails,
      ...(custom_variables || {}) // Allow custom variables from frontend
    };

    // 5. Send email (with OAuth2 if user has connected Gmail)
    const result = await sendTemplateEmail({
      to: contact.email,
      templateSubject: template.subject_line,
      templateBody: template.message_body,
      variables,
      userId: req.user.id // Pass user ID for OAuth2
    });

    // 6. Log to outreach_messages table
    const { data: outreachMessage, error: logError } = await supabase
      .from('outreach_messages')
      .insert({
        mail_item_id: mail_item_id || null,
        contact_id: contact_id,
        message_type: message_type || template.template_type,
        channel: 'Email',
        message_content: template.message_body,
        sent_at: new Date().toISOString(),
        responded: false,
        follow_up_needed: true
      })
      .select()
      .single();

    if (logError) {
      console.error('Failed to log outreach message:', logError);
      // Don't fail the request if logging fails
    }

    res.json({
      success: true,
      messageId: result.messageId,
      outreachMessage: outreachMessage,
      sentTo: contact.email
    });

  } catch (error) {
    console.error('Send notification email error:', error);
    next(error);
  }
}

/**
 * Send custom email (no template)
 * POST /api/emails/send-custom
 * Body: { to, subject, body, contact_id?, mail_item_id? }
 */
async function sendCustomEmail(req, res, next) {
  try {
    const { to, subject, body, contact_id, mail_item_id } = req.body;

    // Validation
    if (!to || !subject || !body) {
      return res.status(400).json({ 
        error: 'to, subject, and body are required' 
      });
    }

    // Convert plain text to HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          ${body.replace(/\n/g, '<br>')}
        </div>
      </body>
      </html>
    `;

    // Send email (with OAuth2 if user has connected Gmail)
    const result = await sendEmail({
      to,
      subject,
      htmlContent,
      textContent: body,
      userId: req.user.id // Pass user ID for OAuth2
    });

    // Log to database if contact_id provided
    if (contact_id) {
      const { error: logError } = await supabase
        .from('outreach_messages')
        .insert({
          mail_item_id: mail_item_id || null,
          contact_id: contact_id,
          message_type: 'Custom',
          channel: 'Email',
          message_content: body,
          sent_at: new Date().toISOString(),
          responded: false,
          follow_up_needed: false
        });

      if (logError) {
        console.error('Failed to log custom email:', logError);
      }
    }

    res.json({
      success: true,
      messageId: result.messageId,
      sentTo: to
    });

  } catch (error) {
    console.error('Send custom email error:', error);
    next(error);
  }
}

/**
 * Test email configuration
 * GET /api/emails/test
 */
async function testEmailConfig(req, res, next) {
  try {
    const testEmail = req.query.to || process.env.SMTP_USER;
    
    if (!testEmail) {
      return res.status(400).json({ 
        error: 'Provide test email as query parameter: ?to=email@example.com' 
      });
    }

    const result = await sendEmail({
      to: testEmail,
      subject: 'Test Email from MeiWay Mail Management System',
      htmlContent: '<h2>✅ Email Service is Working!</h2><p>This is a test email from your mail management system.</p>',
      textContent: '✅ Email Service is Working!\n\nThis is a test email from your mail management system.',
      userId: req.user.id // Pass user ID for OAuth2
    });

    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      sentTo: testEmail
    });

  } catch (error) {
    console.error('Test email error:', error);
    next(error);
  }
}

module.exports = {
  sendNotificationEmail,
  sendCustomEmail,
  testEmailConfig
};


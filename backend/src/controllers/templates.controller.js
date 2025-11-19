const { getSupabaseClient } = require('../services/supabase.service');

/**
 * GET /api/templates
 * Get all message templates (user's + defaults)
 */
exports.getMessageTemplates = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient(req.user.token);
    
    // Get templates for the authenticated user (their own + defaults)
    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .or(`user_id.eq.${req.user.id},is_default.eq.true`)
      .order('is_default', { ascending: false })
      .order('template_name', { ascending: true });

    if (error) {
      console.error('Error fetching message templates:', error);
      return res.status(500).json({ error: 'Failed to fetch templates' });
    }

    res.json({ templates: data || [] });
  } catch (error) {
    next(error);
  }
};


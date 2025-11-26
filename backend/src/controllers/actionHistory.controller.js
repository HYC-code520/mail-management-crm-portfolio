const { getSupabaseClient } = require('../services/supabase.service');

// Get action history for a specific mail item
exports.getActionHistory = async (req, res) => {
  try {
    const { mailItemId } = req.params;
    const supabase = getSupabaseClient(req.user.token);

    const { data, error } = await supabase
      .from('action_history')
      .select('*')
      .eq('mail_item_id', mailItemId)
      .order('action_timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching action history:', error);
      return res.status(500).json({ error: 'Failed to fetch action history' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in getActionHistory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new action history entry
exports.createActionHistory = async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.user.token);
    const {
      mail_item_id,
      action_type,
      action_description,
      previous_value,
      new_value,
      performed_by,
      notes
    } = req.body;

    // Validation
    if (!mail_item_id || !action_type || !action_description || !performed_by) {
      return res.status(400).json({
        error: 'Missing required fields: mail_item_id, action_type, action_description, performed_by'
      });
    }

    const { data, error } = await supabase
      .from('action_history')
      .insert([{
        mail_item_id,
        action_type,
        action_description,
        previous_value,
        new_value,
        performed_by,
        notes,
        action_timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating action history:', error);
      return res.status(500).json({ error: 'Failed to create action history entry' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in createActionHistory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Bulk create action history entries (useful for migrations)
exports.createBulkActionHistory = async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.user.token);
    const { actions } = req.body;

    if (!Array.isArray(actions) || actions.length === 0) {
      return res.status(400).json({ error: 'actions must be a non-empty array' });
    }

    const { data, error } = await supabase
      .from('action_history')
      .insert(actions)
      .select();

    if (error) {
      console.error('Error creating bulk action history:', error);
      return res.status(500).json({ error: 'Failed to create action history entries' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in createBulkActionHistory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


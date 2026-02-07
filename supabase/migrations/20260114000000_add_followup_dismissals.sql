-- Migration: Add follow-up dismissal functionality
-- This migration adds:
-- 1. followup_dismissals table for per-contact dismissals
-- 2. dismissed_at/dismissed_by columns on mail_items for per-item dismissals

-- ============================================
-- 1. Create followup_dismissals table
-- ============================================
-- Tracks when a contact's items have been dismissed from follow-up view
-- Dismissals are per-contact (dismiss all items for a customer at once)

CREATE TABLE IF NOT EXISTS followup_dismissals (
    dismissal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(contact_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dismissed_at TIMESTAMPTZ DEFAULT NOW(),
    dismissed_by TEXT NOT NULL,
    notes TEXT,
    undone_at TIMESTAMPTZ,
    undone_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_followup_dismissals_contact ON followup_dismissals(contact_id);
CREATE INDEX IF NOT EXISTS idx_followup_dismissals_user ON followup_dismissals(user_id);
CREATE INDEX IF NOT EXISTS idx_followup_dismissals_active ON followup_dismissals(contact_id)
    WHERE undone_at IS NULL;

-- Enable RLS
ALTER TABLE followup_dismissals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their dismissals"
    ON followup_dismissals
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create dismissals"
    ON followup_dismissals
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their dismissals"
    ON followup_dismissals
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Comments
COMMENT ON TABLE followup_dismissals IS 'Tracks contacts dismissed from follow-up view. Dismissals are per-contact (all items hidden at once).';
COMMENT ON COLUMN followup_dismissals.undone_at IS 'NULL while dismissed; set to timestamp when user clicks Restore/Undo';
COMMENT ON COLUMN followup_dismissals.dismissed_by IS 'Staff member name who dismissed (e.g., Merlin, Madison)';

-- ============================================
-- 2. Add dismissed columns to mail_items
-- ============================================
-- For per-item dismissals (dismiss individual items)

ALTER TABLE mail_items ADD COLUMN IF NOT EXISTS dismissed_at TIMESTAMPTZ;
ALTER TABLE mail_items ADD COLUMN IF NOT EXISTS dismissed_by TEXT;

-- Index for filtering dismissed items
CREATE INDEX IF NOT EXISTS idx_mail_items_dismissed ON mail_items(dismissed_at)
    WHERE dismissed_at IS NOT NULL;

-- Comments
COMMENT ON COLUMN mail_items.dismissed_at IS 'Timestamp when item was dismissed from follow-up. NULL if not dismissed.';
COMMENT ON COLUMN mail_items.dismissed_by IS 'Staff member name who dismissed the item.';

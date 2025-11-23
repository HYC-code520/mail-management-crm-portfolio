-- Add quantity column to mail_items table
-- This allows tracking multiple items in a single entry (e.g., 7 letters, 3 packages)

ALTER TABLE mail_items 
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Update existing rows to have quantity = 1 if NULL
UPDATE mail_items 
SET quantity = 1 
WHERE quantity IS NULL;

-- Add a check constraint to ensure quantity is always positive
ALTER TABLE mail_items
ADD CONSTRAINT mail_items_quantity_positive CHECK (quantity > 0);



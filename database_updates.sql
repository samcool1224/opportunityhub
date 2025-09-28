-- Add new columns to students table for immediate registration system
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add new columns to professors table for immediate registration system
ALTER TABLE professors 
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for better performance on cleanup operations
CREATE INDEX IF NOT EXISTS idx_students_email_confirmed_created_at 
ON students(email_confirmed, created_at);

CREATE INDEX IF NOT EXISTS idx_professors_email_confirmed_created_at 
ON professors(email_confirmed, created_at);

-- Update existing records to have email_confirmed = true and created_at = now()
UPDATE students 
SET email_confirmed = true, created_at = NOW() 
WHERE email_confirmed IS NULL OR created_at IS NULL;

UPDATE professors 
SET email_confirmed = true, created_at = NOW() 
WHERE email_confirmed IS NULL OR created_at IS NULL;

-- Create a function to clean up unconfirmed accounts (optional - can be called manually)
CREATE OR REPLACE FUNCTION cleanup_unconfirmed_accounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete unconfirmed students older than 24 hours
  DELETE FROM students 
  WHERE email_confirmed = false 
  AND created_at < NOW() - INTERVAL '24 hours';
  
  -- Delete unconfirmed professors older than 24 hours
  DELETE FROM professors 
  WHERE email_confirmed = false 
  AND created_at < NOW() - INTERVAL '24 hours';
  
  -- Note: To also delete auth users, you would need to call this from a serverless function
  -- with admin privileges, or use Supabase's built-in user management
END;
$$;

-- Grant execute permission on the cleanup function
GRANT EXECUTE ON FUNCTION cleanup_unconfirmed_accounts() TO authenticated;

-- Optional: Create a cron job to run cleanup every hour (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-unconfirmed-accounts', '0 * * * *', 'SELECT cleanup_unconfirmed_accounts();');

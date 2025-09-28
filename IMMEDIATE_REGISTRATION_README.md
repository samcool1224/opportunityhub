# Immediate Registration System

## Overview

The registration system has been updated to store all user data immediately in the database tables instead of relying on localStorage. This provides better data persistence and eliminates the need for complex localStorage management.

## How It Works

### 1. **Immediate Data Storage**
- When a user registers (student or professor), their profile data is immediately stored in the respective database table
- Files (portfolio/resume for students, verification documents for professors) are uploaded to Supabase storage immediately
- All data is marked with `email_confirmed: false` initially

### 2. **Email Confirmation Flow**
- User receives confirmation email from Supabase
- When they click the confirmation link, Supabase marks their auth account as confirmed
- When they log in for the first time after confirmation, the `email_confirmed` field is updated to `true`

### 3. **Automatic Cleanup**
- Unconfirmed accounts older than 24 hours are automatically deleted
- This prevents database bloat from abandoned registrations
- Cleanup runs every hour via a scheduled function

## Database Changes Required

Run the following SQL in your Supabase SQL editor:

```sql
-- Add new columns to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add new columns to professors table
ALTER TABLE professors 
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_email_confirmed_created_at 
ON students(email_confirmed, created_at);

CREATE INDEX IF NOT EXISTS idx_professors_email_confirmed_created_at 
ON professors(email_confirmed, created_at);

-- Update existing records
UPDATE students 
SET email_confirmed = true, created_at = NOW() 
WHERE email_confirmed IS NULL OR created_at IS NULL;

UPDATE professors 
SET email_confirmed = true, created_at = NOW() 
WHERE email_confirmed IS NULL OR created_at IS NULL;
```

## Storage Bucket Setup

Ensure you have a storage bucket called `user-files` with the following structure:
- `user-files/{userId}/portfolios/` - for student portfolio/resume files
- `user-files/{userId}/verification/` - for professor verification documents

### Storage Policies

```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to read files
CREATE POLICY "Users can read files" ON storage.objects
FOR SELECT USING (auth.uid():: true);

-- Allow public read access to portfolio files (for professors to view)
CREATE POLICY "Public read access to portfolios" ON storage.objects
FOR SELECT USING (storage.foldername(name)[2] = 'portfolios');
```

## Cleanup Function

A cleanup function is provided to delete unconfirmed accounts:

```sql
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
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION cleanup_unconfirmed_accounts() TO authenticated;
```

## Benefits of New System

1. **No Data Loss**: All registration data is immediately stored in the database
2. **Better Security**: No sensitive data stored in localStorage
3. **Automatic Cleanup**: Prevents database bloat from abandoned registrations
4. **Simplified Logic**: No complex localStorage management or pending registration handling
5. **Better Performance**: Direct database operations instead of localStorage operations

## Migration Notes

- Existing users will automatically have `email_confirmed: true` and `created_at: NOW()`
- The system will work seamlessly with existing data
- No changes needed to existing user accounts

## Testing

1. **Student Registration**: Create a new student account and verify data is stored immediately
2. **Professor Registration**: Create a new professor account and verify data is stored immediately
3. **Email Confirmation**: Confirm email and verify `email_confirmed` is updated on login
4. **Cleanup**: Test the cleanup function manually or wait for automatic cleanup

## Troubleshooting

### Common Issues

1. **"email_confirmed column doesn't exist"**: Run the database update SQL
2. **File upload fails**: Check storage bucket policies and bucket name
3. **Cleanup not working**: Verify the cleanup function exists and has proper permissions

### Manual Cleanup

If you need to manually clean up unconfirmed accounts:

```sql
SELECT cleanup_unconfirmed_accounts();
```

Or manually delete:

```sql
DELETE FROM students WHERE email_confirmed = false AND created_at < NOW() - INTERVAL '24 hours';
DELETE FROM professors WHERE email_confirmed = false AND created_at < NOW() - INTERVAL '24 hours';
```

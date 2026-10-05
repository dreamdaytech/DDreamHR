-- Manually confirm the super admin's email address
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'super.admin@dreamday.hr';

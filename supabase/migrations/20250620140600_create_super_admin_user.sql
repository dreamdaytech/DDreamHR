-- Create Super Admin User

DO $$
DECLARE
    super_admin_user_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Create the user in auth.users
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
    VALUES (super_admin_user_id, 'authenticated', 'authenticated', 'super.admin@dreamday.hr', crypt('superadmin123', gen_salt('bf')), NOW());

    -- Create the user profile and set as super admin
    INSERT INTO public.user_profiles (id, first_name, last_name, is_super_admin)
    VALUES (super_admin_user_id, 'Super', 'Admin', TRUE);
END $$;

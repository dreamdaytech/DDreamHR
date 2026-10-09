-- Source-control migration for production version 20261008180451.
-- The operation set is recovered from the combined SECURITY DEFINER grant
-- migration present in commit d926215d5dd815d061f58c8bbfcb813d555fdc54,
-- then split by the version names recorded in production migration history.
-- Live PostgreSQL grants were checked against these intended privileges on 2026-10-09.
-- Invitation preview remains available before sign-in, but not via PUBLIC defaults
-- and not to authenticated callers.
revoke execute on function public.preview_employee_invitation(text) from public;
revoke execute on function public.preview_employee_invitation(text) from authenticated;
grant execute on function public.preview_employee_invitation(text) to anon;

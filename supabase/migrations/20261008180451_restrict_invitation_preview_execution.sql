-- Invitation previews are intentionally available before sign-in, but not
-- through the PUBLIC default grant or to authenticated users.
-- This is a source-control reconstruction from the currently deployed grants and
-- the combined remediation migration; it is not a recovered copy of the original
-- migration body. Validate against the original deployment artifact before release.
revoke execute on function public.preview_employee_invitation(text) from public;
revoke execute on function public.preview_employee_invitation(text) from authenticated;
grant execute on function public.preview_employee_invitation(text) to anon;

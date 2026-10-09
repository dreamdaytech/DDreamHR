-- Restrict SECURITY DEFINER RPC execution to the authenticated role where intended.
-- This is a source-control reconstruction from the currently deployed grants and
-- the combined remediation migration; it is not a recovered copy of the original
-- migration body. Validate against the original deployment artifact before release.
revoke execute on function public.accept_employee_invitation(text) from public;
revoke execute on function public.complete_my_onboarding_item(text) from public;
revoke execute on function public.register_business_tenant(text,text,text,text,text,text,text,text,time,time,text,integer,integer,text) from public;
revoke execute on function public.resubmit_workflow_request(uuid) from public;
revoke execute on function public.route_workflow_to_inbox(uuid,uuid,text) from public;

grant execute on function public.accept_employee_invitation(text) to authenticated;
grant execute on function public.complete_my_onboarding_item(text) to authenticated;
grant execute on function public.register_business_tenant(text,text,text,text,text,text,text,text,time,time,text,integer,integer,text) to authenticated;
grant execute on function public.resubmit_workflow_request(uuid) to authenticated;
grant execute on function public.route_workflow_to_inbox(uuid,uuid,text) to authenticated;

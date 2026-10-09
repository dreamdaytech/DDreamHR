-- Source-control migration for production version 20261008180439.
-- The operation set is recovered from the combined SECURITY DEFINER grant
-- migration present in commit d926215d5dd815d061f58c8bbfcb813d555fdc54,
-- then split by the version names recorded in production migration history.
-- Live PostgreSQL grants were checked against these intended privileges on 2026-10-09.
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

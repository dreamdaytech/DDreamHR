alter table public.business_invitations
  add column if not exists requires_password boolean not null default true;

update public.business_invitations
set requires_password = not auth_user_existed
where auth_user_existed is not null;

alter table public.business_invitations
  alter column invited_by set not null;

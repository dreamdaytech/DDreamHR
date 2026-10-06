create index if not exists idx_fk_business_invitations_invited_by
  on public.business_invitations(invited_by);

create index if not exists idx_fk_business_invitations_accepted_by
  on public.business_invitations(accepted_by);

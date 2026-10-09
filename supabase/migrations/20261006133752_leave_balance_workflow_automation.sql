create or replace function private.sync_leave_balance_and_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  leave_year integer;
  actor uuid;
begin
  leave_year := extract(year from coalesce(new.start_date, old.start_date))::int;
  actor := (select auth.uid());

  if tg_op = 'INSERT' then
    if new.status = 'pending' then
      insert into public.leave_balances (
        business_id, employee_id, leave_type_id, year, allocated, carried_over, used, pending
      )
      select new.business_id, new.employee_id, new.leave_type_id, leave_year,
             coalesce(lt.annual_allowance,0), 0, 0, new.days
      from public.leave_types lt
      where lt.id = new.leave_type_id
      on conflict (employee_id, leave_type_id, year) do update
      set pending = public.leave_balances.pending + excluded.pending,
          updated_at = now();
    end if;

    insert into public.leave_request_events (leave_request_id, action, actor_user_id, comment)
    values (new.id, 'submitted', actor, null);

    return new;
  end if;

  if old.status is distinct from new.status then
    if old.status = 'draft' and new.status = 'pending' then
      update public.leave_balances
      set pending = pending + new.days, updated_at = now()
      where employee_id = new.employee_id
        and leave_type_id = new.leave_type_id
        and year = leave_year;
    elsif old.status = 'pending' and new.status = 'approved' then
      update public.leave_balances
      set pending = greatest(0, pending - old.days),
          used = used + new.days,
          updated_at = now()
      where employee_id = new.employee_id
        and leave_type_id = new.leave_type_id
        and year = leave_year;
    elsif old.status = 'pending' and new.status in ('rejected','cancelled') then
      update public.leave_balances
      set pending = greatest(0, pending - old.days),
          updated_at = now()
      where employee_id = new.employee_id
        and leave_type_id = new.leave_type_id
        and year = leave_year;
    elsif old.status = 'approved' and new.status = 'cancelled' then
      update public.leave_balances
      set used = greatest(0, used - old.days),
          updated_at = now()
      where employee_id = new.employee_id
        and leave_type_id = new.leave_type_id
        and year = leave_year;
    end if;

    insert into public.leave_request_events (leave_request_id, action, actor_user_id, comment)
    values (new.id, new.status, actor, new.review_comment);
  end if;

  return new;
end;
$$;

revoke all on function private.sync_leave_balance_and_event() from public, anon, authenticated;

drop trigger if exists leave_request_balance_event on public.leave_requests;
create trigger leave_request_balance_event
after insert or update of status on public.leave_requests
for each row execute function private.sync_leave_balance_and_event();

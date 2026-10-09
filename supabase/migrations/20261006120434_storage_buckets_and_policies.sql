insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'documents',
    'documents',
    false,
    26214400,
    array[
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/webp',
      'text/plain',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]::text[]
  ),
  (
    'avatars',
    'avatars',
    true,
    5242880,
    array['image/png','image/jpeg','image/webp']::text[]
  ),
  (
    'payslips',
    'payslips',
    false,
    10485760,
    array['application/pdf']::text[]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "avatars authenticated upload own folder"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "avatars authenticated update own objects"
on storage.objects for update to authenticated
using (
  bucket_id = 'avatars'
  and owner_id = (select auth.uid())::text
)
with check (
  bucket_id = 'avatars'
  and owner_id = (select auth.uid())::text
);

create policy "avatars authenticated delete own objects"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatars'
  and owner_id = (select auth.uid())::text
);

create policy "documents authenticated read authorized metadata"
on storage.objects for select to authenticated
using (
  bucket_id = 'documents'
  and exists (
    select 1
    from public.documents d
    where d.storage_bucket = 'documents'
      and d.storage_path = name
  )
);

create policy "documents authenticated upload business folder"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'documents'
  and private.user_in_business_text((storage.foldername(name))[1])
);

create policy "documents owner or hr update"
on storage.objects for update to authenticated
using (
  bucket_id = 'documents'
  and (
    owner_id = (select auth.uid())::text
    or exists (
      select 1
      from public.business_users bu
      where bu.user_id = (select auth.uid())
        and bu.status = 'active'
        and bu.role in ('admin','hr')
        and bu.business_id::text = (storage.foldername(name))[1]
    )
  )
)
with check (
  bucket_id = 'documents'
  and (
    owner_id = (select auth.uid())::text
    or exists (
      select 1
      from public.business_users bu
      where bu.user_id = (select auth.uid())
        and bu.status = 'active'
        and bu.role in ('admin','hr')
        and bu.business_id::text = (storage.foldername(name))[1]
    )
  )
);

create policy "documents owner or hr delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'documents'
  and (
    owner_id = (select auth.uid())::text
    or exists (
      select 1
      from public.business_users bu
      where bu.user_id = (select auth.uid())
        and bu.status = 'active'
        and bu.role in ('admin','hr')
        and bu.business_id::text = (storage.foldername(name))[1]
    )
  )
);

create policy "payslips authorized read"
on storage.objects for select to authenticated
using (
  bucket_id = 'payslips'
  and exists (
    select 1
    from public.payslips p
    where p.file_path = name
  )
);

create policy "payslips hr upload"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'payslips'
  and exists (
    select 1
    from public.business_users bu
    where bu.user_id = (select auth.uid())
      and bu.status = 'active'
      and bu.role in ('admin','hr')
      and bu.business_id::text = (storage.foldername(name))[1]
  )
);

create policy "payslips hr update"
on storage.objects for update to authenticated
using (
  bucket_id = 'payslips'
  and exists (
    select 1
    from public.business_users bu
    where bu.user_id = (select auth.uid())
      and bu.status = 'active'
      and bu.role in ('admin','hr')
      and bu.business_id::text = (storage.foldername(name))[1]
  )
)
with check (
  bucket_id = 'payslips'
  and exists (
    select 1
    from public.business_users bu
    where bu.user_id = (select auth.uid())
      and bu.status = 'active'
      and bu.role in ('admin','hr')
      and bu.business_id::text = (storage.foldername(name))[1]
  )
);

create policy "payslips hr delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'payslips'
  and exists (
    select 1
    from public.business_users bu
    where bu.user_id = (select auth.uid())
      and bu.status = 'active'
      and bu.role in ('admin','hr')
      and bu.business_id::text = (storage.foldername(name))[1]
  )
);

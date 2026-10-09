-- Restrict private document downloads to files with visible, authorized metadata.
-- Correlate the requested Storage object name to the exact documents metadata path.
drop policy if exists "documents authenticated read authorized metadata" on storage.objects;
create policy "documents authenticated read authorized metadata"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and exists (
    select 1
    from public.documents d
    where d.storage_bucket = 'documents'
      and d.storage_path = objects.name
  )
);

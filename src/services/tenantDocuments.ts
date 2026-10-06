import { supabase } from '@/integrations/supabase/client';
import { getTenantContext } from '@/hooks/useTenantContext';

export type TenantDocument = {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'document';
  category: 'HR Policies' | 'Employee' | 'Company' | 'Legal';
  dateUploaded: string;
  uploadedBy: string;
  size: string;
  accessLevel: 'Public' | 'HR Only' | 'Management' | 'Private';
  expiryDate?: string;
};

const mapType = (mimeType?: string | null, name = ''): TenantDocument['type'] => {
  if (mimeType?.includes('pdf') || /\.pdf$/i.test(name)) return 'pdf';
  if (mimeType?.startsWith('image/')) return 'image';
  if (mimeType?.includes('sheet') || /\.(xlsx?|csv)$/i.test(name)) return 'spreadsheet';
  return 'document';
};

const formatFileSize = (bytes?: number | null) => {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const accessToUi = (level: string): TenantDocument['accessLevel'] => {
  if (level === 'public' || level === 'business') return 'Public';
  if (level === 'hr_only') return 'HR Only';
  if (level === 'management') return 'Management';
  return 'Private';
};

const mapDocument = (row: any): TenantDocument => {
  const uploader = Array.isArray(row.uploader) ? row.uploader[0] : row.uploader;
  return {
    id: row.id,
    name: row.name,
    type: mapType(row.mime_type, row.name),
    category: ['HR Policies', 'Employee', 'Company', 'Legal'].includes(row.category)
      ? row.category
      : 'Employee',
    dateUploaded: row.created_at?.slice(0, 10) || '',
    uploadedBy: uploader
      ? `${uploader.first_name || ''} ${uploader.last_name || ''}`.trim() || 'DDreamHR User'
      : 'DDreamHR User',
    size: formatFileSize(row.size_bytes),
    accessLevel: accessToUi(row.access_level),
    expiryDate: row.expires_at?.slice(0, 10) || undefined,
  };
};

export const listTenantDocuments = async (): Promise<TenantDocument[]> => {
  const context = await getTenantContext();
  if (!context?.businessId) return [];

  const { data, error } = await supabase
    .from('documents')
    .select('*, uploader:uploaded_by(first_name,last_name)')
    .eq('business_id', context.businessId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapDocument);
};

export const uploadTenantDocuments = async (files: File[]): Promise<TenantDocument[]> => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const created: TenantDocument[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const storagePath = `${context.businessId}/documents/${context.employeeId || context.userId}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        upsert: false,
        contentType: file.type || undefined,
      });

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        business_id: context.businessId,
        employee_id: context.employeeId || null,
        name: file.name,
        category: 'Employee',
        storage_bucket: 'documents',
        storage_path: storagePath,
        mime_type: file.type || null,
        size_bytes: file.size,
        access_level: 'private',
        uploaded_by: context.userId,
      })
      .select('*, uploader:uploaded_by(first_name,last_name)')
      .single();

    if (error) {
      await supabase.storage.from('documents').remove([storagePath]);
      throw error;
    }

    created.push(mapDocument(data));
  }

  return created;
};

export const downloadTenantDocument = async (documentId: string) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const { data: document, error: documentError } = await supabase
    .from('documents')
    .select('name,storage_bucket,storage_path')
    .eq('business_id', context.businessId)
    .eq('id', documentId)
    .single();

  if (documentError) throw documentError;

  const { data: blob, error } = await supabase.storage
    .from(document.storage_bucket)
    .download(document.storage_path);

  if (error) throw error;
  return { name: document.name, blob };
};

export const deleteTenantDocument = async (documentId: string) => {
  const context = await getTenantContext();
  if (!context?.businessId) throw new Error('No tenant is assigned to this account.');

  const { data: document, error: documentError } = await supabase
    .from('documents')
    .select('storage_bucket,storage_path')
    .eq('business_id', context.businessId)
    .eq('id', documentId)
    .single();

  if (documentError) throw documentError;

  const { error: storageError } = await supabase.storage
    .from(document.storage_bucket)
    .remove([document.storage_path]);

  if (storageError) throw storageError;

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('business_id', context.businessId)
    .eq('id', documentId);

  if (error) throw error;
};

import { createClient, type User } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
export const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const STORAGE_BUCKET = process.env.SUPABASE_ARTWORK_BUCKET || 'artwork-images';

export function getAdminClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('Missing Supabase server configuration.');
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function requireAdmin(request: Request): Promise<User> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!token || !SUPABASE_URL || !ANON_KEY) throw new Error('UNAUTHORIZED');
  const authClient = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user?.email) throw new Error('UNAUTHORIZED');

  const allowed = (process.env.ADMIN_EMAILS || '').split(',').map((value) => value.trim().toLowerCase()).filter(Boolean);
  if (allowed.length === 0 || !allowed.includes(data.user.email.toLowerCase())) throw new Error('FORBIDDEN');
  return data.user;
}

export function storagePathFromPublicUrl(url: string | null | undefined) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
}

export async function uploadArtworkImage(file: File, title: string) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) throw new Error('Please upload a JPEG, PNG, or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image uploads must be 5MB or smaller.');
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const slug = title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'artwork';
  const path = `${slug}-${crypto.randomUUID()}.${extension}`;
  const admin = getAdminClient();
  const { error } = await admin.storage.from(STORAGE_BUCKET).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (error) throw error;
  return { url: admin.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl, path };
}

export async function removeArtworkImage(url: string | null | undefined) {
  const path = storagePathFromPublicUrl(url);
  if (!path) return;
  const { error } = await getAdminClient().storage.from(STORAGE_BUCKET).remove([path]);
  if (error) throw error;
}

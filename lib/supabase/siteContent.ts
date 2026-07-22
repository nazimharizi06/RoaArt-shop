import { supabase } from './client';

export interface SiteContent {
  title: string;
  body: string;
}

const defaultContent: SiteContent = {
  title: 'A gallery built for modern collectors.',
  body: 'Roaartny is a polished storefront experience for showcasing original artwork, managing inventory, and accepting secure payments through Stripe.',
};

const storageKey = 'roaartny-site-content';

function readLocalFallback(): SiteContent {
  if (typeof window === 'undefined') return defaultContent;

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return defaultContent;

  try {
    const parsed = JSON.parse(saved) as SiteContent;
    return parsed.title || parsed.body ? parsed : defaultContent;
  } catch {
    return defaultContent;
  }
}

function writeLocalFallback(content: SiteContent) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, JSON.stringify(content));
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  const localFallback = readLocalFallback();

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('title, body')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return localFallback;
    }

    const content = {
      title: data.title ?? localFallback.title,
      body: data.body ?? localFallback.body,
    };

    writeLocalFallback(content);
    return content;
  } catch {
    return localFallback;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  writeLocalFallback(content);

  try {
    await supabase.from('site_settings').upsert(
      {
        id: 'site',
        title: content.title,
        body: content.body,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch {
    // Ignore Supabase storage issues and keep local fallback intact.
  }
}

import { getStoredDemoUser } from '@/lib/demoAccounts';

const PREFIX = 'ddreamhr_demo_v1:';

export const isDemoSession = () => Boolean(getStoredDemoUser());

export const readDemoData = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeDemoData = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('ddreamhr:demo-store', { detail: { key } }));
};

export const clearDemoData = (key: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PREFIX + key);
  window.dispatchEvent(new CustomEvent('ddreamhr:demo-store', { detail: { key } }));
};

export const downloadTextFile = (filename: string, content: string, mime = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const toCsv = (rows: Array<Record<string, string | number | boolean | null | undefined>>) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const text = value == null ? '' : String(value);
    return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  };
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
};

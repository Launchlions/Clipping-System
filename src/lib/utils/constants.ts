export const PLATFORM_NAME = 'ClipBridge';
export const COMMISSION_RATE = Number(process.env.PLATFORM_COMMISSION_RATE) || 0.15;
export const CLAIM_EXPIRY_HOURS = 48;
export const ATTRIBUTION_WINDOW_DAYS = 7;
export const MAX_ATTRIBUTION_WINDOW_DAYS = 14;
export const TRACKING_POLL_INTERVAL_HOURS = 6;
export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];

export const ITEMS_PER_PAGE = 25;

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

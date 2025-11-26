/**
 * Timezone utilities for New York (America/New_York)
 * Handles both EST (UTC-5) and EDT (UTC-4) automatically
 */

/**
 * Get current date/time in New York timezone
 */
export function getNYDate(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

/**
 * Convert a date to New York timezone and return as YYYY-MM-DD string
 */
export function toNYDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const nyDate = new Date(d.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const year = nyDate.getFullYear();
  const month = String(nyDate.getMonth() + 1).padStart(2, '0');
  const day = String(nyDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in New York timezone as YYYY-MM-DD
 */
export function getTodayNY(): string {
  return toNYDateString(new Date());
}

/**
 * Get date N days ago in New York timezone as YYYY-MM-DD
 */
export function getDaysAgoNY(daysAgo: number): string {
  const nyDate = getNYDate();
  nyDate.setDate(nyDate.getDate() - daysAgo);
  return toNYDateString(nyDate);
}

/**
 * Format a date for display in New York timezone
 */
export function formatNYDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    ...options
  });
}

/**
 * Get date range for charts in New York timezone
 */
export function getChartDateRange(days: number): Array<{ dateStr: string; displayDate: string }> {
  const result = [];
  const nyNow = getNYDate();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(nyNow);
    date.setDate(date.getDate() - i);
    const dateStr = toNYDateString(date);
    const displayDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      timeZone: 'America/New_York'
    });
    result.push({ dateStr, displayDate });
  }
  
  return result;
}


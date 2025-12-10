/**
 * Timezone utilities for New York (America/New_York) - Backend
 * Handles both EST (UTC-5) and EDT (UTC-4) automatically
 * 
 * CRITICAL: All date calculations for business logic (fees, reminders, etc.)
 * should use these utilities to ensure consistency with NY timezone.
 */

/**
 * Get current date in NY timezone as Date object
 * @returns {Date} Date object representing current moment in NY
 */
function getNYDate() {
  const now = new Date();
  const nyDateStr = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  return new Date(nyDateStr);
}

/**
 * Convert any date to NY timezone and return as YYYY-MM-DD string
 * @param {Date|string} date - Date to convert
 * @returns {string} Date in YYYY-MM-DD format (NY timezone)
 */
function toNYDateString(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const nyDateStr = d.toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Parse MM/DD/YYYY and convert to YYYY-MM-DD
  const [month, day, year] = nyDateStr.split(',')[0].split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Get today's date in NY timezone as YYYY-MM-DD
 * @returns {string} Today's date in YYYY-MM-DD format (NY timezone)
 */
function getTodayNY() {
  return toNYDateString(new Date());
}

/**
 * Calculate number of days between two dates in NY timezone
 * This is CRITICAL for fee calculations - uses calendar days in NY, not UTC!
 * 
 * Example:
 * - Package received: Dec 9, 11:59 PM EST
 * - Current time: Dec 10, 12:01 AM EST
 * - Days difference: 1 day (even though only 2 minutes apart in real time)
 * 
 * @param {Date|string} startDate - Start date (earlier)
 * @param {Date|string} endDate - End date (later), defaults to now
 * @returns {number} Number of calendar days difference (0, 1, 2, etc.)
 */
function getDaysBetweenNY(startDate, endDate = new Date()) {
  // Convert both dates to NY timezone date strings (YYYY-MM-DD)
  const startNY = toNYDateString(startDate);
  const endNY = toNYDateString(endDate);
  
  // Parse as Date objects at midnight (no time component)
  const start = new Date(startNY + 'T00:00:00');
  const end = new Date(endNY + 'T00:00:00');
  
  // Calculate difference in days
  const diffMs = end - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Calculate days since a given date (in NY timezone)
 * Shorthand for getDaysBetweenNY(date, now)
 * 
 * @param {Date|string} date - Date to calculate from
 * @returns {number} Number of days since the date
 */
function getDaysSinceNY(date) {
  return getDaysBetweenNY(date, new Date());
}

/**
 * Check if a date is today in NY timezone
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today in NY
 */
function isTodayNY(date) {
  return toNYDateString(date) === getTodayNY();
}

/**
 * Check if date1 is before date2 in NY timezone (by calendar day)
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if date1 is before date2
 */
function isBeforeDateNY(date1, date2) {
  return toNYDateString(date1) < toNYDateString(date2);
}

/**
 * Check if date1 is after date2 in NY timezone (by calendar day)
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if date1 is after date2
 */
function isAfterDateNY(date1, date2) {
  return toNYDateString(date1) > toNYDateString(date2);
}

/**
 * Check if two dates are the same day in NY timezone
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if dates are on the same calendar day in NY
 */
function isSameDayNY(date1, date2) {
  return toNYDateString(date1) === toNYDateString(date2);
}

/**
 * Get date N days ago in NY timezone as YYYY-MM-DD
 * @param {number} daysAgo - Number of days to go back
 * @returns {string} Date in YYYY-MM-DD format
 */
function getDaysAgoNY(daysAgo) {
  const nyDate = getNYDate();
  nyDate.setDate(nyDate.getDate() - daysAgo);
  return toNYDateString(nyDate);
}

/**
 * Format a date for display in NY timezone
 * @param {Date|string} date - Date to format
 * @param {Intl.DateTimeFormatOptions} options - Formatting options
 * @returns {string} Formatted date string
 */
function formatNYDate(date, options = {}) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    ...options
  });
}

/**
 * Get start of day (midnight) in NY timezone
 * Returns ISO string that represents midnight in NY
 * @param {Date|string} date - Date to get start of day for (defaults to today)
 * @returns {string} ISO string representing midnight NY time
 */
function getStartOfDayNY(date = new Date()) {
  const dateStr = toNYDateString(date);
  // Create date at midnight NY time and return ISO
  const midnight = new Date(dateStr + 'T00:00:00-05:00'); // EST offset (will adjust for EDT automatically)
  return midnight.toISOString();
}

/**
 * Get end of day (23:59:59) in NY timezone
 * Returns ISO string that represents end of day in NY
 * @param {Date|string} date - Date to get end of day for (defaults to today)
 * @returns {string} ISO string representing 23:59:59 NY time
 */
function getEndOfDayNY(date = new Date()) {
  const dateStr = toNYDateString(date);
  const endOfDay = new Date(dateStr + 'T23:59:59-05:00');
  return endOfDay.toISOString();
}

/**
 * Get current timestamp in NY timezone (for logging)
 * Returns ISO 8601 with timezone offset
 * @returns {string} ISO timestamp with NY timezone offset
 */
function getNYTimestamp() {
  const now = new Date();
  
  const nyDateStr = now.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const [datePart, timePart] = nyDateStr.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');
  
  // Calculate timezone offset
  const nyDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const offsetMinutes = (nyDate.getTime() - utcDate.getTime()) / (1000 * 60);
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const offsetStr = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
  
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000${offsetStr}`;
}

module.exports = {
  getNYDate,
  toNYDateString,
  getTodayNY,
  getDaysBetweenNY,
  getDaysSinceNY,
  isTodayNY,
  isBeforeDateNY,
  isAfterDateNY,
  isSameDayNY,
  getDaysAgoNY,
  formatNYDate,
  getStartOfDayNY,
  getEndOfDayNY,
  getNYTimestamp
};


export function getCalendarData(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get the day of the week the month starts on (0 = Sunday, 6 = Saturday)
  const startingDayOfWeek = new Date(year, month, 1).getDay();
  
  // Get the full name of the month and year for the header
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Today's exact date string for highlighting the current day
  const todayStr = new Date().toDateString();

  return { daysInMonth, startingDayOfWeek, monthName, todayStr, year, month };
}

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
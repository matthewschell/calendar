// Math helpers to calculate floating holidays
const _nthWeekday = (y, month, weekday, n) => {
  const d = new Date(y, month, 1);
  let count = 0;
  while (true) {
    if (d.getDay() === weekday) {
      count++;
      if (count === n) return new Date(d);
    }
    d.setDate(d.getDate() + 1);
  }
};

const _lastWeekdayBefore = (y, month, day, weekday) => {
  const d = new Date(y, month, day);
  while (d.getDay() !== weekday) d.setDate(d.getDate() - 1);
  return d;
};

// Complex algorithm to calculate Easter Sunday
const _getEaster = (y) => {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const d2 = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d2 - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month, day);
};

export const getHolidaysForYear = (year) => {
  const easter = _getEaster(year);
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  
  const canadaDay = new Date(year, 6, 1); // July 1st
  if (canadaDay.getDay() === 0) canadaDay.setDate(2); // Observed on Monday if it falls on Sunday

  return [
    { date: new Date(year, 0, 1),                        name: "New Year's Day",   emoji: '🍁' },
    { date: _nthWeekday(year, 1, 1, 3),                  name: "Family Day",       emoji: '🍁' },
    { date: goodFriday,                                  name: "Good Friday",      emoji: '🍁' },
    { date: canadaDay,                                   name: "Canada Day",       emoji: '🍁' },
    { date: _lastWeekdayBefore(year, 4, 24, 1),          name: "Victoria Day",     emoji: '🍁' },
    { date: _nthWeekday(year, 7, 1, 1),                  name: "Civic Holiday",    emoji: '🍁' },
    { date: _nthWeekday(year, 8, 1, 1),                  name: "Labour Day",       emoji: '🍁' },
    { date: _nthWeekday(year, 9, 1, 2),                  name: "Thanksgiving",     emoji: '🍁' },
    { date: new Date(year, 11, 25),                      name: "Christmas Day",    emoji: '🍁' },
    { date: new Date(year, 11, 26),                      name: "Boxing Day",       emoji: '🍁' },
    { date: new Date(year, 1, 14),                       name: "Valentine's Day",  emoji: '💝' },
    { date: new Date(year, 2, 17),                       name: "St. Patrick's Day",emoji: '☘️' },
    { date: easter,                                      name: "Easter Sunday",    emoji: '🐣' },
    { date: _nthWeekday(year, 4, 0, 2),                  name: "Mother's Day",     emoji: '💐' },
    { date: _nthWeekday(year, 5, 0, 3),                  name: "Father's Day",     emoji: '👔' },
  ];
};

// Generate this year and next year so we have overlap
const currentYear = new Date().getFullYear();
export const HOLIDAYS_DATA = [
  ...getHolidaysForYear(currentYear),
  ...getHolidaysForYear(currentYear + 1)
].map(h => ({
  id: `hol-${h.date.toDateString()}-${h.name}`,
  title: `${h.emoji} ${h.name}`,
  date: h.date.toDateString(),
  member: ['misc'], // Tagged as misc so it gets the grey styling
  isHoliday: true
}));

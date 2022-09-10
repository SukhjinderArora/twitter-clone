const checkIfEmpty = (obj) => {
  if (obj && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
};

const setAllObjectProperties = (obj, value) => {
  const newObj = Object.keys(obj).reduce((acc, cur) => {
    acc[cur] = value;
    return acc;
  }, {});
  return newObj;
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        reject(new Error(`Failed to load the script ${src}`));
      };
      document.body.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

const STATUS = Object.freeze({
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

const NOTIFICATION_TYPE = Object.freeze({
  POST: 'post',
  REPOST: 'repost',
  REPLY: 'reply',
  LIKE: 'like',
  FOLLOW: 'follow',
});

const DateOptions = {
  months: [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ],
  year_range: 120,
  daysInMonth(month, year) {
    if (!month || !year) return [];
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({ value: String(i), label: String(i) });
    }
    return days;
  },
  getYearsInRange(yearRange) {
    const years = [];
    const currentYear = new Date().getFullYear();
    // eslint-disable-next-line no-plusplus
    for (let i = currentYear; i >= currentYear - yearRange; i--) {
      years.push({ value: String(i), label: String(i) });
    }
    return years;
  },
};

export {
  checkIfEmpty,
  setAllObjectProperties,
  loadScript,
  STATUS,
  NOTIFICATION_TYPE,
  DateOptions,
};

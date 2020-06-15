var dayjs = require('dayjs');

// console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'));
const date1 = dayjs('2019-10-21 16:15:12');
const date2 = dayjs('2019-10-21 16:17:12');
console.log(date1.diff(date2, 'minute'));
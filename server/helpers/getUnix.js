import dayjs from 'dayjs'

export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

export default time => (
  time 
    ? dayjs(time, TIME_FORMAT)
    : dayjs()
  ).unix()

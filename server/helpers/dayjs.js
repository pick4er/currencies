import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

dayjs.extend(utc)

export default dayjs

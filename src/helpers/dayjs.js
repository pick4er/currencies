import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm'
export const CHART_TIME_FORMAT = 'DD.MM.YY HH:mm'

dayjs.extend(utc)

export default dayjs

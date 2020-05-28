import dayjs from 'dayjs';
import {
  getRandomRate,
  convertPeriodToSeconds
} from '../helpers';

const TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

function getHistory(ctx) {
  const {
    base,
    period,
    currency,
    to: toTime,
    from: fromTime,
  } = ctx.query

  const fromUnix = dayjs(fromTime, TIME_FORMAT).unix()
  const toUnix = dayjs(toTime, TIME_FORMAT).unix()
  const secondsInPeriod = convertPeriodToSeconds(period)
  const periodsAmount = parseInt(
    (toUnix - fromUnix) / secondsInPeriod,
    10
  )

  const rates = []
  for (let i = 1; i <= periodsAmount; i++) {
    const unixTimestamp = fromUnix + (secondsInPeriod * i)
    const timestamp = dayjs.unix(unixTimestamp).format(TIME_FORMAT)
    const rate = getRandomRate(currency.toLowerCase())

    rates.push({
      timestamp,
      rate
    })
  }

  ctx.set({ 'Content-Type': 'application/json' })
  ctx.body = rates
  ctx.status = 200
}

export default getHistory

import {
  dayjs,
  TIME_FORMAT,
  getRandomRate,
  convertPeriodToSeconds,
} from '../helpers'

function getHistory(ctx) {
  const {
    period,
    currency,
    to: toTime,
    from: fromTime,
  } = ctx.query

  const fromUnix = dayjs.utc(fromTime, TIME_FORMAT).unix()
  const toUnix = dayjs.utc(toTime, TIME_FORMAT).unix()
  const secondsInPeriod = convertPeriodToSeconds(
    period.toLowerCase()
  )
  const periodsAmount = parseInt(
    (toUnix - fromUnix) / secondsInPeriod,
    10
  )

  if (periodsAmount > 500) {
    ctx.body = 'Period is too large'
    ctx.status = 213

    return
  }

  const rates = []
  for (let i = 1; i <= periodsAmount; i++) {
    const unixTimestamp = fromUnix + secondsInPeriod * i
    const time = dayjs
      .utc(dayjs.unix(unixTimestamp))
      .format(TIME_FORMAT)
    const value = getRandomRate(currency.toLowerCase())

    rates.push({ time, value })
  }

  ctx.set({ 'Content-Type': 'application/json' })
  ctx.body = rates
  ctx.status = 200
}

export default getHistory

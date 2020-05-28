import dayjs from 'dayjs'
import {
  getUnix,
  TIME_FORMAT,
  getRandomRate,
  convertPeriodToSeconds
} from '../helpers';

const secondsInPeriod = convertPeriodToSeconds('1m')
let last_changed = dayjs().format(TIME_FORMAT)
const rates = {
  usd: undefined,
  eur: undefined,
}

async function updateRates(ctx, next) {
  const timestamp = dayjs().unix()
  const lastTimestamp = getUnix(last_changed)
  const periodsPassed = parseInt(
    (timestamp - lastTimestamp) / secondsInPeriod,
    10
  )
  last_changed = dayjs.unix(
    lastTimestamp + periodsPassed * secondsInPeriod
  ).format(TIME_FORMAT)
  ctx.last_changed = last_changed

  ctx.rates = {}
  Object.keys(rates).forEach(currency => {
    rates[currency] = getRandomRate(currency)
    ctx.rates[currency] = rates[currency]
  })

  await next()
}

export default updateRates

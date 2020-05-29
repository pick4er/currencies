import dayjs from 'dayjs'
import {
  getUnix,
  TIME_FORMAT,
  getRandomRate,
  convertPeriodToSeconds,
} from '../helpers'

const secondsInPeriod = convertPeriodToSeconds('1m')
let last_changed = dayjs().format(TIME_FORMAT)
const rates = {
  usd: getRandomRate('usd'),
  eur: getRandomRate('eur'),
}

async function updateRates(ctx, next) {
  const timestamp = dayjs().unix()
  const lastTimestamp = getUnix(last_changed)
  const periodsPassed = parseInt(
    (timestamp - lastTimestamp) / secondsInPeriod,
    10
  )
  const next_last_changed = dayjs
    .unix(lastTimestamp + periodsPassed * secondsInPeriod)
    .format(TIME_FORMAT)

  if (last_changed !== next_last_changed) {
    // update rates
    Object.keys(rates).forEach((currency) => {
      rates[currency] = getRandomRate(currency)
    })
  }

  ctx.rates = { ...rates }
  last_changed = next_last_changed
  ctx.last_changed = last_changed

  await next()
}

export default updateRates

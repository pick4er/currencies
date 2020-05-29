import {
  dayjs,
  TIME_FORMAT,
  getRandomRate,
  convertPeriodToSeconds,
} from '../helpers'

const secondsInPeriod = convertPeriodToSeconds('1m')
let lastChanged = dayjs.utc().format(TIME_FORMAT)
const rates = {
  usd: getRandomRate('usd'),
  eur: getRandomRate('eur'),
}

async function updateRates(ctx, next) {
  const timestamp = dayjs.utc().unix()
  const lastTimestamp = dayjs
    .utc(lastChanged, TIME_FORMAT)
    .unix()
  const periodsPassed = parseInt(
    (timestamp - lastTimestamp) / secondsInPeriod,
    10
  )
  const nextLastChanged = dayjs
    .utc(
      dayjs.unix(
        lastTimestamp + periodsPassed * secondsInPeriod
      )
    )
    .format(TIME_FORMAT)

  if (lastChanged !== nextLastChanged) {
    // update rates
    Object.keys(rates).forEach((currency) => {
      rates[currency] = getRandomRate(currency)
    })
  }

  ctx.rates = { ...rates }
  lastChanged = nextLastChanged
  ctx.lastChanged = lastChanged

  await next()
}

export default updateRates

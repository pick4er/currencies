import dayjs from 'dayjs';
import { createSelector } from 'reselect';
import {
  getLatestRates,
  getHistoryRates,
} from 'api';

import { notify } from 'flux/modules/notifications';
import {
  TIME_FORMAT,
  createCurrencyPair,
  convertPeriodToSeconds,
} from 'helpers';

export const Periods = {
  day: '1d',
  hour: '1h',
  minute: '1m',
  fiveMinutes: '5m',
}

export const Colors = {
  usd: '#005A9E',
  eur: '#FFB347',
}

const SERVER_UPDATES_PERIOD = Periods.minute

// Actions
const SET_BASE = 'CURRENCIES/SET_BASE';
const SET_CURRENCIES = 'CURRENCIES/SET_CURRENCIES';
const SET_RATES = 'CURRENCIES/SET_RATES';
const SET_TIMER_ID = 'CURRENCIES/SET_TIMER_ID';
const SET_PERIOD = 'CURRENCIES/SET_PERIOD';

const initialState = {
  base: 'RUB',
  currencies: ['USD', 'EUR'],
  rates: new Map(),
  period: Periods.fiveMinutes,
  timerId: undefined,
}

export default function reducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case SET_BASE:
      return {
        ...state,
        base: payload
      };
    case SET_PERIOD:
      return {
        ...state,
        period: payload,
      }
    case SET_CURRENCIES:
      return {
        ...state,
        currencies: payload
      }
    case SET_RATES:
      return {
        ...state,
        rates: payload
      }
    case SET_TIMER_ID:
      return {
        ...state,
        timerId: payload
      }
    default:
      return state
  }
}

// Selectors
const selectCurrenciesModule = state => state.currencies

export const selectBaseCurrency = createSelector(
  selectCurrenciesModule,
  ({ base }) => base
)

export const selectTimerId = createSelector(
  selectCurrenciesModule,
  ({ timerId }) => timerId,
)

export const selectRates = createSelector(
  selectCurrenciesModule,
  ({ rates }) => rates
)

export const selectPeriod = createSelector(
  selectCurrenciesModule,
  ({ period }) => period
)

export const selectRatesByCurrencies = createSelector(
  selectRates,
  rates => {
    const ratesWithUnixTime = new Map()
    for (
      const [
        currency,
        values,
      ] of rates.entries()
    ) {
      const valuesWithUnixTime = values.map(
        ({ time, ...rest }) => ({
          ...rest,
          time: dayjs(time, TIME_FORMAT).unix(),
        })
      )
      ratesWithUnixTime.set(currency, valuesWithUnixTime)
    }

    return ratesWithUnixTime
  },
)

export const selectRatesByTime = createSelector(
  selectRates,
  rates => {
    let ratesByTime = []
    for (
      const [
        currency,
        values,
      ] of rates.entries()
    ) {
      if (ratesByTime.length === 0) {
        ratesByTime = ratesByTime.concat(values)
      }

      ratesByTime.forEach((dayRate, index) => {
        if (values[index].time !== dayRate.time) {
          throw new TypeError(
            'Rates arrays must be \
            sorted and equal by time'
          )
        }

        dayRate[currency] = values[index].value
      })
    }

    return ratesByTime.reverse()
  },
)

export const selectCurrencies = createSelector(
  selectCurrenciesModule,
  ({ currencies }) => currencies || []
)

export const selectCurrencyPairs = createSelector(
  selectBaseCurrency,
  selectCurrencies,
  (base, currencies) => currencies.reduce(
    (acc, curr) => 
      acc
        ? `${acc},`
        : acc
      + createCurrencyPair(base, curr), ''
  )
)

// Action creators
export const setBaseCurrency = payload => ({
  type: SET_BASE,
  payload
})

export const setCurrencies = payload => ({
  type: SET_CURRENCIES,
  payload
})

export const setRates = payload => ({
  type: SET_RATES,
  payload
})

export const setTimerId = payload => ({
  type: SET_TIMER_ID,
  payload,
})

export const setPeriod = payload => ({
  type: SET_PERIOD,
  payload,
})

// Middleware
export const initRates = () =>
async (dispatch, getState) => {
  const base = selectBaseCurrency(getState())
  const period = selectPeriod(getState())
  const currencies = selectCurrencies(getState())
  const rates = new Map()
  const timeTo = dayjs().format(TIME_FORMAT)
  const timeFrom =
    dayjs().subtract(1, 'day').format(TIME_FORMAT)

  await Promise.all(
    currencies.map(async currency => {
      const result = await getHistoryRates({
        base,
        period,
        currency,
        to: timeTo,
        from: timeFrom,
      })

      rates.set(currency, result)
    })
  )
  
  dispatch(setRates(rates))
}

export const pingRates = () => (dispatch, getState) => {
  const base = selectBaseCurrency(getState())
  const currencies = selectCurrencies(getState())

  setTimeout(async function ping() {
    const nextRates = new Map()
    let lastServerUpdate = undefined
    const ratesUpdate = {}

    await Promise.all(
      currencies.map(async currency => {
        const result = await getLatestRates({
          base,
          currency,
        })

        lastServerUpdate = result.last_changed
        ratesUpdate[currency] = result
      })
    )

    const rates = selectRates(getState())
    for (
      const [
        currency,
        values,
      ] of rates.entries()
    ) {
      const nextRate = ratesUpdate[currency]
      const nextValues = JSON.parse(JSON.stringify(values))
      nextValues.push({
        time: nextRate.last_changed,
        value: nextRate.value
      })

      nextRates.set(currency, nextValues)
    }

    dispatch(setRates(nextRates))

    const currentTimerId = selectTimerId(getState())
    const period = selectPeriod(getState())

    console.log(`--> [${currentTimerId}] lastServerUpdate: ${lastServerUpdate}`)
    let nextTimeout = convertPeriodToSeconds('1m') * 1000
    if (typeof currentTimer === 'undefined') {
      // sync with most recent server updates
      const lastServerUpdateInMsc = dayjs(
        lastServerUpdate, TIME_FORMAT
      ).unix() * 1000
      const nextServerUpdateInMsc = dayjs(
        lastServerUpdate, TIME_FORMAT
      ).add(
        convertPeriodToSeconds(SERVER_UPDATES_PERIOD), 's'
      ).unix() * 1000

      console.log(`--> [${currentTimerId}] lastServerUpdateInMsc: ${lastServerUpdateInMsc}`)
      console.log(`--> [${currentTimerId}] nextServerUpdateInMsc: ${nextServerUpdateInMsc}`)
      nextTimeout = nextServerUpdateInMsc - lastServerUpdateInMsc
    }

    console.log(`--> [${currentTimerId}] nextTimeout: ${nextTimeout}`)
    dispatch(setTimerId(setTimeout(ping, nextTimeout)))
  }, 0)
}

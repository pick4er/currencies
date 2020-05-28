import dayjs from 'dayjs';
import { createSelector } from 'reselect';
import { getHistoryRates } from 'api';

import { notify } from 'flux/modules/notifications';
import {
  TIME_FORMAT,
  createCurrencyPair,
} from 'helpers';

const Periods = {
  day: '1d',
  hour: '1h',
  minute: '1m',
  fiveMinutes: '5m',
}

// Actions
const SET_BASE = 'CURRENCIES/SET_BASE';
const SET_CURRENCIES = 'CURRENCIES/SET_CURRENCIES';
const SET_RATES = 'CURRENCIES/SET_RATES';

const initialState = {
  base: 'RUB',
  currencies: ['USD', 'EUR'],
  rates: new Map(),
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

export const selectRatesByCurrencies = createSelector(
  selectCurrenciesModule,
  ({ rates }) => rates,
)

export const selectRatesByTimestamp = createSelector(
  selectRatesByCurrencies,
  ratesByCurrencies => {
    let ratesByTimestamp = []
    for (
      const [
        currency,
        value,
      ] of ratesByCurrencies.entries()
    ) {
      if (ratesByTimestamp.length === 0) {
        ratesByTimestamp = ratesByTimestamp.concat(value)
      }

      ratesByTimestamp.forEach((dayRate, index) => {
        if (value[index].timestamp !== dayRate.timestamp) {
          throw new TypeError(
            'Rates arrays must be \
            sorted and equal by timestamp'
          )
        }

        dayRate[currency] = value[index].rate
      })
    }

    return ratesByTimestamp
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

// Middleware
export const initRates = () =>
async (dispatch, getState) => {
  const base = selectBaseCurrency(getState())
  const currencies = selectCurrencies(getState())
  const rates = new Map()
  const timeTo = dayjs().format(TIME_FORMAT)
  const timeFrom =
    dayjs().subtract(1, 'day').format(TIME_FORMAT)

  await Promise.all(
    currencies.map(async currency => {
      const result = await getHistoryRates({
        base,
        currency,
        period: Periods.fiveMinutes,
        from: timeFrom,
        to: timeTo,
      })

      rates.set(currency, result)
    })
  )
  
  dispatch(setRates(rates))
}

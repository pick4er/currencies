import dayjs from 'dayjs';
import { createSelector } from 'reselect';
import { getHistoryRates } from 'api';

import { notify } from 'flux/modules/notifications';
import {
  createCurrencyPair,
  sanitizeHistoryData,
} from 'helpers';

const Periods = {
  day: '1d',
  hour: '1h'
}

// Actions
const SET_BASE = 'CURRENCIES/SET_BASE';
const SET_CURRENCIES = 'CURRENCIES/SET_CURRENCIES';
const SET_RATES = 'CURRENCIES/SET_RATES';

const initialState = {
  base: undefined,
  currencies: undefined,
  rates: undefined,
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
  ({ rates }) => rates || [],
)

export const selectRatesByTimestamp = createSelector(
  selectCurrenciesModule,
  ({ rates }) => {
    // TODO: create new list of objects (map), separated by timestamp
    return []
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

export const setRate = payload => ({
  type: SET_RATES,
  payload
})

// Middleware
export const initDashboard = () => dispatch => {
  dispatch(setBaseCurrency('RUB'))
  dispatch(setCurrencies(['USD', 'EUR']))
  dispatch(initRates())
}

export const initRates = () =>
async (dispatch, getState) => {
  const base = selectBaseCurrency(getState())
  const currencies = selectCurrencies(getState())
  const rates = new Map()
  const timeFrom = dayjs('2020-05-20').format('YYYY-MM-DDTHH:mm:ss')
  const timeTo = dayjs().format('YYYY-MM-DDTHH:mm:ss')

  await Promise.all(
    currencies.map(async currency => {
      const result = await getHistoryRates({
        symbol: createCurrencyPair(currency, base),
        period: Periods.hour,
        from: timeFrom,
        to: timeTo,
      })

      if (result?.code !== '200') {
        dispatch(notify(result.code))
      } else {
        rates.set(
          currency,
          sanitizeHistoryData(result.response)
        )
      }
    })
  )
}

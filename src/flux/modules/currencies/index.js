import { createSelector } from 'reselect';

// Actions
const SET_BASE = 'CURRENCIES/SET_BASE';
const SET_CURRENCIES = 'CURRENCIES/SET_CURRENCIES';
const SET_RATE = 'CURRENCIES/SET_RATE';

const initialState = {
  base: 'rub',
  currencies: ['usd', 'eur'],
  rates: undefined
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
    case SET_RATE:
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

export const selectRates = createSelector(
  selectCurrenciesModule,
  ({ rates }) => rates,
)

export const selectCurrencies = createSelector(
  selectCurrenciesModule,
  ({ currencies }) => currencies
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
  type: SET_RATE,
  payload
})


import { createSelector } from 'reselect'

export const Modes = {
  Table: 'TABLE',
  Chart: 'CHART',
}

// Actions
const SET_MODE = 'DASHBOARD/SET_MODE'

const initialState = {
  mode: Modes.Table,
}

export default function reducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case SET_MODE:
      return {
        ...state,
        mode: payload,
      }
    default:
      return state
  }
}

// Selectors
const selectDashboardModule = (state) => state.dashboard

export const selectMode = createSelector(
  selectDashboardModule,
  ({ mode }) => mode
)

// Action creators
export const setMode = (payload) => ({
  type: SET_MODE,
  payload,
})

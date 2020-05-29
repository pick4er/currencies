import { createSelector } from 'reselect'

export const Notifications = {
  PerMinuteLimit: '213',
  AccountBlocked: '103',
  PerMonthLimit: '211',
}

// Actions
const SET_NOTIFICATION = 'DASHBOARD/SET_NOTIFICATION'
const SET_NOTIFICATION_TIMER =
  'DASHBOARD/SET_NOTIFICATION_TIMER'

const initialState = {
  notification: undefined,
  notificationTimer: undefined,
}

export default function reducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        notification: payload,
      }
    case SET_NOTIFICATION_TIMER:
      return {
        ...state,
        notificationTimer: payload,
      }
    default:
      return state
  }
}

// Selectors
const selectNotificationsModule = (state) =>
  state.notifications

export const selectNotification = createSelector(
  selectNotificationsModule,
  ({ notification }) => notification
)

export const selectNotificationTimer = createSelector(
  selectNotificationsModule,
  ({ notificationTimer }) => notificationTimer
)

// Action creators
export const setNotification = (payload) => ({
  type: SET_NOTIFICATION,
  payload,
})

export const setNotificationTimer = (payload) => ({
  type: SET_NOTIFICATION_TIMER,
  payload,
})

// Middleware
export const notify = (code) => (dispatch, getState) => {
  if (code === '213') {
    dispatch(setNotification(Notifications.PerMinuteLimit))
  } else if (code === '103') {
    dispatch(setNotification(Notifications.AccountBlocked))
  } else if (code === '211') {
    dispatch(setNotification(Notifications.PerMonthLimit))
  }

  const notification = selectNotification(getState())
  if (notification) {
    const notificationTimer = setTimeout(() => {
      dispatch(setNotification(undefined))
      dispatch(setNotificationTimer(undefined))
    }, 20000)

    dispatch(setNotificationTimer(notificationTimer))
  }
}

import thunk from 'redux-thunk';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';

import notifications from 'flux/modules/notifications';
import currencies from 'flux/modules/currencies';
import dashboard from 'flux/modules/dashboard';

export default createStore(
  combineReducers({
    currencies,
    dashboard,
    notifications,
  }),
  applyMiddleware(thunk),
);

import thunk from 'redux-thunk';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';

import currencies from 'flux/modules/currencies';
import dashboard from 'flux/modules/dashboard';

export default createStore(
  combineReducers({ currencies, dashboard, }),
  applyMiddleware(thunk),
);

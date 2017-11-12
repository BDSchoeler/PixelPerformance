import { combineReducers } from 'redux';

import authentication from './authentication';
import product from './product';
import snackbar from './snackbar';
import registration from './registration';
import client from './client';

const reducers = combineReducers({
	authentication,
  product,
	snackbar,
	registration,
	client
});

export default reducers;

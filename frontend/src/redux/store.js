// frontend/src/redux/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Import as a named export
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
} from './reducers/userReducers';
import {
  problemListReducer,
  problemDetailsReducer,
  problemCreateReducer,
} from './reducers/problemReducers';
import {
  solutionListReducer,
  solutionCreateReducer,
} from './reducers/solutionReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  problemList: problemListReducer,
  problemDetails: problemDetailsReducer,
  problemCreate: problemCreateReducer,
  solutionList: solutionListReducer,
  solutionCreate: solutionCreateReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

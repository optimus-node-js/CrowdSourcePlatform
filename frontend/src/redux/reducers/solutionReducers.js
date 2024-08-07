// frontend/src/redux/reducers/solutionReducers.js
import {
  SOLUTION_LIST_REQUEST,
  SOLUTION_LIST_SUCCESS,
  SOLUTION_LIST_FAIL,
  SOLUTION_CREATE_REQUEST,
  SOLUTION_CREATE_SUCCESS,
  SOLUTION_CREATE_FAIL,
} from '../constants/solutionConstants';

export const solutionListReducer = (state = { solutions: [] }, action) => {
  switch (action.type) {
    case SOLUTION_LIST_REQUEST:
      return { loading: true, solutions: [] };
    case SOLUTION_LIST_SUCCESS:
      return { loading: false, solutions: action.payload };
    case SOLUTION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const solutionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SOLUTION_CREATE_REQUEST:
      return { loading: true };
    case SOLUTION_CREATE_SUCCESS:
      return { loading: false, success: true };
    case SOLUTION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

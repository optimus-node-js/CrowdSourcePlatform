// frontend/src/redux/actions/problemActions.js
import axios from 'axios';
import {
  PROBLEM_LIST_REQUEST,
  PROBLEM_LIST_SUCCESS,
  PROBLEM_LIST_FAIL,
  PROBLEM_DETAILS_REQUEST,
  PROBLEM_DETAILS_SUCCESS,
  PROBLEM_DETAILS_FAIL,
  PROBLEM_CREATE_REQUEST,
  PROBLEM_CREATE_SUCCESS,
  PROBLEM_CREATE_FAIL,
} from '../constants/problemConstants';

// List Problems Action
export const listProblems = () => async (dispatch) => {
  try {
    dispatch({ type: PROBLEM_LIST_REQUEST });

    const { data } = await axios.get('/api/problems');

    dispatch({
      type: PROBLEM_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROBLEM_LIST_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Get Problem Details Action
export const getProblemDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROBLEM_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/problems/${id}`);

    dispatch({
      type: PROBLEM_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROBLEM_DETAILS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

// Create Problem Action
export const createProblem = (problem) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROBLEM_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/problems', problem, config);

    dispatch({
      type: PROBLEM_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROBLEM_CREATE_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

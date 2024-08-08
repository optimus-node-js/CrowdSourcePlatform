// frontend/src/redux/actions/solutionActions.js
import axios from 'axios';
import {
  SOLUTION_CREATE_REQUEST,
  SOLUTION_CREATE_SUCCESS,
  SOLUTION_CREATE_FAIL,
  SOLUTION_LIST_REQUEST,
  SOLUTION_LIST_SUCCESS,
  SOLUTION_LIST_FAIL,
} from '../constants/solutionConstants';

export const listSolutions = (problemId) => async (dispatch) => {
  try {
    dispatch({ type: SOLUTION_LIST_REQUEST });

    const { data } = await axios.get(`/api/solutions/${problemId}/solutions`);

    dispatch({ type: SOLUTION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SOLUTION_LIST_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const createSolution = (problemId, solution) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: SOLUTION_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.post(`/api/solutions/${problemId}/solutions`, solution, config);

    dispatch({ type: SOLUTION_CREATE_SUCCESS });

    // Re-fetch the solutions to update the list
    dispatch(listSolutions(problemId));
  } catch (error) {
    dispatch({
      type: SOLUTION_CREATE_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const voteSolution = (solutionId, vote) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(`/api/solutions/${solutionId}/vote`, { vote }, config);

    // Re-fetch the solutions to update the list
    dispatch(listSolutions(getState().problemDetails.problem._id));
  } catch (error) {
    console.error(error);
  }
};

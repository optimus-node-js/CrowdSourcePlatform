// frontend/src/redux/actions/solutionActions.js
import axios from 'axios';

export const listSolutions = (problemId) => async (dispatch) => {
  try {
    dispatch({ type: 'SOLUTION_LIST_REQUEST' });

    const { data } = await axios.get(`/api/solutions/${problemId}`);

    dispatch({ type: 'SOLUTION_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'SOLUTION_LIST_FAIL',
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
    dispatch({ type: 'SOLUTION_CREATE_REQUEST' });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/solutions/${problemId}`,
      solution,
      config
    );

    dispatch({ type: 'SOLUTION_CREATE_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'SOLUTION_CREATE_FAIL',
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const voteSolution = (id, vote) => async (dispatch, getState) => {
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

    await axios.put(`/api/solutions/${id}/vote`, { vote }, config);
  } catch (error) {
    console.error(error);
  }
};

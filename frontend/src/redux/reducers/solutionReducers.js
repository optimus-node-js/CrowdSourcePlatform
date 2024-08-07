// frontend/src/redux/reducers/solutionReducers.js
export const solutionListReducer = (state = { solutions: [] }, action) => {
    switch (action.type) {
      case 'SOLUTION_LIST_REQUEST':
        return { loading: true, solutions: [] };
      case 'SOLUTION_LIST_SUCCESS':
        return { loading: false, solutions: action.payload };
      case 'SOLUTION_LIST_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const solutionCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case 'SOLUTION_CREATE_REQUEST':
        return { loading: true };
      case 'SOLUTION_CREATE_SUCCESS':
        return { loading: false, success: true, solution: action.payload };
      case 'SOLUTION_CREATE_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
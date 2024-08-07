// frontend/src/redux/reducers/problemReducers.js
export const problemListReducer = (state = { problems: [] }, action) => {
    switch (action.type) {
      case 'PROBLEM_LIST_REQUEST':
        return { loading: true, problems: [] };
      case 'PROBLEM_LIST_SUCCESS':
        return { loading: false, problems: action.payload };
      case 'PROBLEM_LIST_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const problemDetailsReducer = (state = { problem: {} }, action) => {
    switch (action.type) {
      case 'PROBLEM_DETAILS_REQUEST':
        return { loading: true, problem: {} };
      case 'PROBLEM_DETAILS_SUCCESS':
        return { loading: false, problem: action.payload };
      case 'PROBLEM_DETAILS_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const problemCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case 'PROBLEM_CREATE_REQUEST':
        return { loading: true };
      case 'PROBLEM_CREATE_SUCCESS':
        return { loading: false, success: true, problem: action.payload };
      case 'PROBLEM_CREATE_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
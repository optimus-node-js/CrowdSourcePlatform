// frontend/src/components/ProblemDetails.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProblemDetails } from '../redux/actions/problemActions';
import { listSolutions, createSolution } from '../redux/actions/solutionActions';
import { useParams } from 'react-router-dom';

const ProblemDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const problemDetails = useSelector((state) => state.problemDetails);
  const { loading, error, problem } = problemDetails;

  const solutionList = useSelector((state) => state.solutionList);
  const { solutions } = solutionList;

  const solutionCreate = useSelector((state) => state.solutionCreate);
  const { success: successCreate } = solutionCreate;

  useEffect(() => {
    dispatch(getProblemDetails(id));
    dispatch(listSolutions(id));
  }, [dispatch, id, successCreate]);

  const submitSolutionHandler = (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    dispatch(createSolution(id, { content }));
    e.target.elements.content.value = '';
  };

  return (
    <div className="container mx-auto mt-5">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <p>{problem.description}</p>
          <form onSubmit={submitSolutionHandler} className="mt-4">
            <textarea
              name="content"
              rows="3"
              placeholder="Enter your solution"
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              Submit Solution
            </button>
          </form>
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Solutions</h2>
            {solutions.map((solution) => (
              <div key={solution._id} className="p-2 border rounded mb-2">
                <p>{solution.content}</p>
                <p className="text-gray-500">By: {solution.user.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProblemDetails;

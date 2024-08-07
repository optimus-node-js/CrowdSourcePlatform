// frontend/src/components/ProblemList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProblems } from '../redux/actions/problemActions';
import { Link } from 'react-router-dom';

const ProblemList = () => {
  const dispatch = useDispatch();

  const problemList = useSelector((state) => state.problemList);
  const { loading, error, problems } = problemList;

  useEffect(() => {
    dispatch(listProblems());
  }, [dispatch]);

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Problems</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {problems.map((problem) => (
            <div key={problem._id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-bold">{problem.title}</h2>
              <p>{problem.description}</p>
              <Link to={`/problems/${problem._id}`} className="text-blue-500">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;

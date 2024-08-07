// frontend/src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/userActions';

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl">
            Problem Solver
          </Link>
          <div>
            {userInfo ? (
              <>
                <Link to="/profile" className="text-white px-4">
                  Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  className="text-white px-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white px-4">
                  Login
                </Link>
                <Link to="/register" className="text-white px-4">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

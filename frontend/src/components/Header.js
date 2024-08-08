import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
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
    <AppBar position="static" style={{ background: 'linear-gradient(90deg, #ff6a6a, #ff7a3d)' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Problem Solver
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {userInfo ? (
            <>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" onClick={logoutHandler}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

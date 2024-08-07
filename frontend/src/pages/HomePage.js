// frontend/src/pages/HomePage.js
import React from 'react';
import { useSelector } from 'react-redux';
import ProblemList from '../components/ProblemList';
import { Container, Typography, Box, Grid } from '@mui/material';
import LoginForm from '../components/LoginForm'; // Assuming you have a separate login form component

const HomePage = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <Container>
      {userInfo ? (
        // Display problems if the user is logged in
        <ProblemList />
      ) : (
        // Display welcome message and login/signup form if not logged in
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Welcome to Problem Solver!
            </Typography>
            <Typography variant="body1">
              This is a platform where you can share your problems and get solutions from the community.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <LoginForm />
            <Box mt={2}>
              <Typography variant="body2">
                Don't have an account? <a href="/register">Sign up</a>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;

// frontend/src/pages/AddProblemPage.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProblem } from '../redux/actions/problemActions';
import { Container, TextField, Button, Paper, Typography, Box } from '@mui/material';

const AddProblemPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const submitHandler = (e) => {
    e.preventDefault();
    if (title && description) {
      dispatch(createProblem({ title, description }));
      navigate('/');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Problem
        </Typography>
        <Box component="form" onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            fullWidth
            label="Problem Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
            Submit
          </Button>
        </Box>
        <Button variant="outlined" color="primary" onClick={() => navigate('/')}>
          Home
        </Button>
      </Paper>
    </Container>
  );
};

export default AddProblemPage;

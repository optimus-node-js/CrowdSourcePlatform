// frontend/src/pages/AddProblemPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProblem } from '../redux/actions/problemActions'; // Updated import
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddProblemPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const problemCreate = useSelector((state) => state.problemCreate);
  const { loading, success } = problemCreate;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Title and description are required');
      return;
    }
    dispatch(createProblem({ title, description })); // Using createProblem
    if (success) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Problem
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="title"
          label="Problem Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Container>
  );
};

export default AddProblemPage;

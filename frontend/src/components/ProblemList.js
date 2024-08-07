// frontend/src/components/ProblemList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProblems } from '../redux/actions/problemActions';
import { Link } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, Alert } from '@mui/material';

const ProblemList = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const problemList = useSelector((state) => state.problemList);
  const { loading, problems } = problemList;

  useEffect(() => {
    const getProblems = async () => {
      try {
        dispatch(listProblems());
      } catch (error) {
        setError(error.message || 'Failed to load problems');
      }
    };

    getProblems();
  }, [dispatch]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Problems
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={4}>
        {problems.map((problem) => (
          <Grid item key={problem._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">{problem.title}</Typography>
                <Typography>{problem.description}</Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/problems/${problem._id}`} size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProblemList;

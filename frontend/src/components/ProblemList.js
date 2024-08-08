import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProblems } from '../redux/actions/problemActions';
import { Link } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, Alert, Box } from '@mui/material';

const ProblemList = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const problemList = useSelector((state) => state.problemList);
  const { loading, problems } = problemList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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
    <Container style={{ marginTop: '40px' }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Problems
        </Typography>
        {userInfo && (
          <Button variant="contained" color="primary" component={Link} to="/add-problem" style={{ marginLeft: '10px' }}>
            Add Problem
          </Button>
        )}
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={4}>
        {problems.map((problem) => (
          <Grid item key={problem._id} xs={12} sm={6} md={4}>
            <Card
              style={{
                background: '#fff',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <CardContent style={{ padding: '20px' }}>
                <Typography variant="h5" style={{ marginBottom: '10px', fontWeight: '700', color: '#333' }}>
                  {problem.title}
                </Typography>
                <Typography style={{ color: '#666' }}>{problem.description}</Typography>
              </CardContent>
              <CardActions style={{ padding: '20px', background: '#f9f9f9', textAlign: 'center' }}>
                <Button
                  component={Link}
                  to={`/problems/${problem._id}`}
                  size="small"
                  color="primary"
                  style={{
                    color: '#fff',
                    backgroundColor: '#007BFF',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s, transform 0.3s',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#007BFF';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
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

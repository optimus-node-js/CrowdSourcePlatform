import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProblemDetails } from '../redux/actions/problemActions';
import { listSolutions, createSolution, voteSolution } from '../redux/actions/solutionActions';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Alert, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const ProblemPage = () => {
  const { id } = useParams();
  const [solutionText, setSolutionText] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const problemDetails = useSelector((state) => state.problemDetails);
  const { loading, error: problemError, problem } = problemDetails;

  const solutionList = useSelector((state) => state.solutionList);
  const { solutions, error: solutionError } = solutionList;

  const solutionCreate = useSelector((state) => state.solutionCreate);
  const { success: solutionSuccess } = solutionCreate;

  useEffect(() => {
    dispatch(getProblemDetails(id));
    dispatch(listSolutions(id));
  }, [dispatch, id, solutionSuccess]);

  const submitSolutionHandler = (e) => {
    e.preventDefault();
    if (!solutionText) {
      setError('Solution cannot be empty');
      return;
    }
    dispatch(createSolution(id, { text: solutionText }));
    setSolutionText('');
  };

  const voteHandler = (solutionId, vote) => {
    dispatch(voteSolution(solutionId, vote));
  };

  return (
    <Container maxWidth="md">
      {loading ? (
        <Typography variant="h5" component="div" gutterBottom>
          Loading...
        </Typography>
      ) : problemError ? (
        <Alert severity="error">{problemError}</Alert>
      ) : (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              {problem.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {problem.description}
            </Typography>
            <Box component="form" onSubmit={submitSolutionHandler} sx={{ mb: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {solutionError && <Alert severity="error" sx={{ mb: 2 }}>{solutionError}</Alert>}
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                placeholder="Enter your solution"
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary">
                Submit Solution
              </Button>
            </Box>
            <Typography variant="h5" component="div" gutterBottom>
              Solutions
            </Typography>
            {solutions && solutions.map((sol, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">{sol.text}</Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Submitted by: {sol.user ? `${sol.user.firstName} ${sol.user.lastName}` : 'Anonymous'}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Votes: {sol.votes}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => voteHandler(sol._id, 1)}>
                      <ThumbUpIcon />
                    </IconButton>
                    <IconButton onClick={() => voteHandler(sol._id, -1)}>
                      <ThumbDownIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ProblemPage;

// frontend/src/pages/ProfilePage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../redux/actions/userActions';
import { Container, Typography, Box, CircularProgress, Alert, Card, CardContent, Avatar } from '@mui/material';

const ProfilePage = () => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  return (
    <Container maxWidth="sm" style={{ marginTop: '40px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        user && (
          <Card style={{ marginTop: '20px', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <CardContent style={{ textAlign: 'center' }}>
              <Avatar style={{ margin: '0 auto', width: '100px', height: '100px', backgroundColor: '#007BFF', fontSize: '40px' }}>
                {user.firstName && user.firstName.charAt(0)}
                {user.lastName && user.lastName.charAt(0)}
              </Avatar>
              <Typography variant="h5" component="h2" style={{ margin: '20px 0', fontWeight: 'bold' }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Box style={{ textAlign: 'left', marginTop: '20px' }}>
                <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
                <Typography variant="body1"><strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : ''}</Typography>
                <Typography variant="body1"><strong>Gender:</strong> {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : ''}</Typography>
                <Typography variant="body1"><strong>ID:</strong> {user._id}</Typography>
              </Box>
            </CardContent>
          </Card>
        )
      )}
    </Container>
  );
};

export default ProfilePage;

import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Avatar, Button, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { api, errorMessage } from '../api';
import { useAuth } from '../auth';
import { displayName } from '../constants';
import { EmptyState, IssueCard } from '../components/IssueBits';

export default function Profile() {
  const { user, refresh } = useAuth();
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({ firstName: user.firstName || '', lastName: user.lastName || '', city: user.city || '' });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get('/issues', { params: { mine: 'true', sort: 'newest', limit: 50 } }).then(({ data }) => setIssues(data.items));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/auth/me', form);
      await refresh();
      setMsg({ type: 'success', text: 'Profile saved' });
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3 }} component="form" onSubmit={save}>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>{displayName(user).charAt(0)}</Avatar>
              <div>
                <Typography variant="h6">{displayName(user)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.reputation} civic points
                </Typography>
              </div>
            </Stack>
            <Stack spacing={2}>
              {msg && <Alert severity={msg.type}>{msg.text}</Alert>}
              <TextField size="small" label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <TextField size="small" label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              <TextField size="small" label="Home city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} helperText="Used as the default city for your reports" />
              <Button type="submit" variant="contained">
                Save profile
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" mb={2}>
            Issues you reported ({issues.length})
          </Typography>
          {issues.length ? (
            <Grid container spacing={2}>
              {issues.map((i) => (
                <Grid item xs={12} sm={6} key={i._id}>
                  <IssueCard issue={i} onChange={(d) => setIssues((l) => l.map((x) => (x._id === d.id ? { ...x, ...d } : x)))} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyState
              title="You have not reported anything yet"
              body="Noticed something broken on your street?"
              action={
                <Button component={RouterLink} to="/report" variant="contained">
                  Report an issue
                </Button>
              }
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Grid, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { errorMessage } from '../api';
import { useAuth } from '../auth';

function Shell({ title, subtitle, children }) {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 } }}>
        <Box component="img" src="/favicon.svg" alt="" sx={{ width: 40, height: 40, mb: 2 }} />
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          {subtitle}
        </Typography>
        {children}
      </Paper>
    </Container>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/issues', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Shell title="Welcome back" subtitle="Sign in to report issues, vote and share fixes.">
      <Stack spacing={2.5} component="form" onSubmit={submit}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField label="Password" type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" variant="contained" size="large" disabled={busy}>
          {busy ? 'Signing in...' : 'Sign in'}
        </Button>
        <Typography variant="body2" textAlign="center">
          New here?{' '}
          <Link component={RouterLink} to="/register" state={location.state}>
            Create an account
          </Link>
        </Typography>
      </Stack>
    </Shell>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', city: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form);
      navigate(location.state?.from || '/report', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Shell title="Join your neighbours" subtitle="It takes a minute. Your city helps us show you what is happening nearby.">
      <Stack spacing={2.5} component="form" onSubmit={submit}>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label="First name" required value={form.firstName} onChange={set('firstName')} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Last name" value={form.lastName} onChange={set('lastName')} />
          </Grid>
        </Grid>
        <TextField label="Email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} />
        <TextField label="Password" type="password" required autoComplete="new-password" helperText="At least 6 characters" value={form.password} onChange={set('password')} />
        <TextField label="City" placeholder="Ahmedabad" value={form.city} onChange={set('city')} />
        <Button type="submit" variant="contained" size="large" disabled={busy}>
          {busy ? 'Creating account...' : 'Create account'}
        </Button>
        <Typography variant="body2" textAlign="center">
          Already a member?{' '}
          <Link component={RouterLink} to="/login" state={location.state}>
            Sign in
          </Link>
        </Typography>
      </Stack>
    </Shell>
  );
}

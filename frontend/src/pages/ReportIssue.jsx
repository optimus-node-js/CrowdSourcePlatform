import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Grid, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { api, errorMessage } from '../api';
import { useAuth } from '../auth';
import { CATEGORIES, SEVERITIES } from '../constants';

export default function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'roads',
    severity: 'medium',
    city: user?.city || '',
    area: '',
    imageUrl: '',
    tags: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await api.post('/issues', form);
      navigate(`/issues/${data._id}`);
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4">Report a local issue</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        Clear, specific reports get fixed faster. Say what is wrong, exactly where, and how it affects people.
      </Typography>
      <Paper variant="outlined" component="form" onSubmit={submit} sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="What is the problem?"
            placeholder="Streetlights out on the stretch outside Navrangpura bus stop"
            required
            value={form.title}
            onChange={update('title')}
            inputProps={{ maxLength: 120 }}
            helperText={`${form.title.length}/120`}
          />
          <TextField
            label="Details"
            placeholder="Since when, how many people are affected, any safety risk, who you have already contacted"
            required
            multiline
            minRows={5}
            value={form.description}
            onChange={update('description')}
            helperText="At least 20 characters"
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Category" value={form.category} onChange={update('category')}>
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <MenuItem key={k} value={k}>
                    {v.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                How urgent is it?
              </Typography>
              <ToggleButtonGroup fullWidth exclusive size="small" value={form.severity} onChange={(_, v) => v && setForm({ ...form, severity: v })}>
                {Object.entries(SEVERITIES).map(([k, v]) => (
                  <ToggleButton key={k} value={k}>
                    {v.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="City" value={form.city} onChange={update('city')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Area or landmark" placeholder="Ward 12, near Shivranjani cross roads" value={form.area} onChange={update('area')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Photo link (optional)" placeholder="https://..." value={form.imageUrl} onChange={update('imageUrl')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Tags (optional)" placeholder="night, school-zone" value={form.tags} onChange={update('tags')} helperText="Comma separated" />
            </Grid>
          </Grid>
          <Box>
            <Button type="submit" variant="contained" size="large" disabled={saving}>
              {saving ? 'Posting...' : 'Post issue'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

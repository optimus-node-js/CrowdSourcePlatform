import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Container, Grid, LinearProgress, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { api, errorMessage } from '../api';
import { CATEGORIES, STATUSES } from '../constants';

function Tile({ label, value, hint }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.5 }}>
        {value ?? <Skeleton width={70} />}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Paper>
  );
}

function Bar({ label, value, max, sub, to }) {
  return (
    <Box component={to ? RouterLink : 'div'} to={to} sx={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}
          {sub ? ` · ${sub}` : ''}
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={max ? (value / max) * 100 : 0} sx={{ height: 8, borderRadius: 4, mt: 0.75, bgcolor: '#e2e8f0' }} />
    </Box>
  );
}

export default function Dashboard() {
  const [city, setCity] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setStats(null);
    api
      .get('/stats', { params: city ? { city } : {} })
      .then(({ data }) => setStats(data))
      .catch((err) => setError(errorMessage(err)));
  }, [city]);

  const maxCat = Math.max(1, ...(stats?.byCategory || []).map((c) => c.count));
  const maxCity = Math.max(1, ...(stats?.topCities || []).map((c) => c.count));

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} mb={4}>
        <Box>
          <Typography variant="h4">City dashboard</Typography>
          <Typography color="text.secondary">How problems are being reported and resolved across the community</Typography>
        </Box>
        <TextField size="small" label="Filter by city" placeholder="All cities" onKeyDown={(e) => e.key === 'Enter' && setCity(e.target.value.trim())} onBlur={(e) => setCity(e.target.value.trim())} />
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={6} md={3}>
          <Tile label="Total issues" value={stats?.total} hint={stats ? `${stats.reportedThisWeek} this week` : ''} />
        </Grid>
        <Grid item xs={6} md={3}>
          <Tile label="Resolution rate" value={stats ? `${stats.resolutionRate}%` : null} hint={stats ? `${stats.statusCounts.resolved} resolved` : ''} />
        </Grid>
        <Grid item xs={6} md={3}>
          <Tile label="Average time to fix" value={stats ? (stats.avgResolutionDays != null ? `${stats.avgResolutionDays} days` : 'n/a') : null} />
        </Grid>
        <Grid item xs={6} md={3}>
          <Tile label="Fixes and updates" value={stats?.solutions} hint={stats ? `${stats.members} members` : ''} />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Pipeline
            </Typography>
            <Stack spacing={2}>
              {stats
                ? Object.entries(STATUSES).map(([k, v]) => (
                    <Bar key={k} label={v.label} value={stats.statusCounts[k] || 0} max={stats.total} to={`/issues?status=${k}`} />
                  ))
                : [...Array(4)].map((_, i) => <Skeleton key={i} height={32} />)}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              By category
            </Typography>
            <Stack spacing={2}>
              {stats?.byCategory.length
                ? stats.byCategory.map((c) => (
                    <Bar key={c.category} label={CATEGORIES[c.category]?.label || c.category} value={c.count} sub={`${c.open} open`} max={maxCat} to={`/issues?category=${c.category}`} />
                  ))
                : stats && <Typography color="text.secondary">No data yet</Typography>}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Most active cities
            </Typography>
            <Stack spacing={2}>
              {stats?.topCities.length
                ? stats.topCities.map((c) => <Bar key={c.city} label={c.city} value={c.count} max={maxCity} to={`/issues?city=${encodeURIComponent(c.city)}`} />)
                : stats && <Typography color="text.secondary">No data yet</Typography>}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

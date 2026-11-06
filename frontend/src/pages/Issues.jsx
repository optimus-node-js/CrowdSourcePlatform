import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { api, errorMessage } from '../api';
import { CATEGORIES, STATUSES } from '../constants';
import { EmptyState, IssueCard } from '../components/IssueBits';

export default function Issues() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState(params.get('q') || '');

  const filters = {
    q: params.get('q') || '',
    category: params.get('category') || '',
    status: params.get('status') || '',
    city: params.get('city') || '',
    sort: params.get('sort') || 'top',
    page: Number(params.get('page') || 1),
  };

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  useEffect(() => {
    setData(null);
    setError('');
    const query = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api
      .get('/issues', { params: { ...query, limit: 12 } })
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(errorMessage(err)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    const t = setTimeout(() => q !== filters.q && set('q', q.trim()), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const patch = (d) => setData((cur) => ({ ...cur, items: cur.items.map((i) => (i._id === d.id ? { ...i, ...d } : i)) }));

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={2} mb={3}>
        <Box>
          <Typography variant="h4">Community issues</Typography>
          <Typography color="text.secondary">{data ? `${data.total} issue${data.total === 1 ? '' : 's'} found` : 'Loading issues'}</Typography>
        </Box>
        <Button component={RouterLink} to="/report" variant="contained">
          Report an issue
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search title, area or tag"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6} md={2.5}>
          <TextField select fullWidth size="small" label="Category" value={filters.category} onChange={(e) => set('category', e.target.value)}>
            <MenuItem value="">All categories</MenuItem>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <MenuItem key={k} value={k}>
                {v.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField select fullWidth size="small" label="Status" value={filters.status} onChange={(e) => set('status', e.target.value)}>
            <MenuItem value="">Any status</MenuItem>
            {Object.entries(STATUSES).map(([k, v]) => (
              <MenuItem key={k} value={k}>
                {v.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3.5}>
          <TextField fullWidth size="small" label="City" placeholder="e.g. Ahmedabad" defaultValue={filters.city} onBlur={(e) => set('city', e.target.value.trim())} onKeyDown={(e) => e.key === 'Enter' && set('city', e.target.value.trim())} />
        </Grid>
      </Grid>

      <ToggleButtonGroup size="small" exclusive value={filters.sort} onChange={(_, v) => v && set('sort', v)} sx={{ mb: 3 }}>
        <ToggleButton value="top">Most supported</ToggleButton>
        <ToggleButton value="unresolved">Still open</ToggleButton>
        <ToggleButton value="newest">Newest</ToggleButton>
      </ToggleButtonGroup>

      {error && <Alert severity="error">{error}</Alert>}

      {!data && !error ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : data?.items.length ? (
        <>
          <Grid container spacing={3}>
            {data.items.map((issue) => (
              <Grid item xs={12} sm={6} md={4} key={issue._id}>
                <IssueCard issue={issue} onChange={patch} />
              </Grid>
            ))}
          </Grid>
          {data.pages > 1 && (
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination count={data.pages} page={filters.page} onChange={(_, p) => set('page', String(p))} color="primary" />
            </Stack>
          )}
        </>
      ) : (
        data && <EmptyState title="Nothing matches these filters" body="Try a different category or city, or report the problem yourself." />
      )}
    </Container>
  );
}

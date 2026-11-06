import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { api, getSocket } from '../api';
import { EmptyState, IssueCard } from '../components/IssueBits';

const STEPS = [
  { icon: AddLocationAltIcon, title: 'Report', body: 'Spot a broken streetlight, a pothole or an overflowing bin? Post it with the area and how urgent it is.' },
  { icon: HowToVoteOutlinedIcon, title: 'Rally', body: 'Neighbours upvote what affects them, so the most pressing problems rise to the top for everyone to see.' },
  { icon: BuildCircleOutlinedIcon, title: 'Fix', body: 'Volunteers, RWAs and officials post fixes, progress updates and contacts. The best answer gets accepted.' },
  { icon: TaskAltIcon, title: 'Track', body: 'Every issue moves from Reported to Resolved with a public timeline, so nothing quietly disappears.' },
];

function Stat({ value, label }) {
  return (
    <Box>
      <Typography variant="h4" color="primary.main">
        {value ?? <Skeleton width={60} />}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export default function Home() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState(null);

  const load = () => {
    api.get('/stats').then(({ data }) => setStats(data)).catch(() => setStats({}));
    api
      .get('/issues', { params: { sort: 'unresolved', limit: 6 } })
      .then(({ data }) => setIssues(data.items))
      .catch(() => setIssues([]));
  };

  useEffect(() => {
    load();
    const s = getSocket();
    s.on('issue:created', load);
    s.on('issue:status', load);
    return () => {
      s.off('issue:created', load);
      s.off('issue:status', load);
    };
  }, []);

  const patch = (data) => setIssues((list) => list.map((i) => (i._id === data.id ? { ...i, ...data } : i)));

  return (
    <>
      <Box sx={{ background: 'linear-gradient(135deg, #0f766e 0%, #115e59 55%, #134e4a 100%)', color: '#fff', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: '0.12em' }}>
                Community-powered civic issue tracker
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 52 }, mt: 1 }}>
                Fix your neighbourhood, together.
              </Typography>
              <Typography sx={{ mt: 2, fontSize: 18, opacity: 0.9, maxWidth: 560 }}>
                Report potholes, water cuts, dark streets and garbage dumps. Rally the people affected, collect practical fixes and keep
                a public record until the problem is actually solved.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button component={RouterLink} to="/report" size="large" variant="contained" color="secondary" startIcon={<AddLocationAltIcon />}>
                  Report an issue
                </Button>
                <Button component={RouterLink} to="/issues" size="large" variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>
                  See what is happening nearby
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Stat value={stats?.total} label="Issues reported" />
                  </Grid>
                  <Grid item xs={6}>
                    <Stat value={stats ? `${stats.resolutionRate ?? 0}%` : null} label="Resolved" />
                  </Grid>
                  <Grid item xs={6}>
                    <Stat value={stats?.solutions} label="Fixes and updates shared" />
                  </Grid>
                  <Grid item xs={6}>
                    <Stat value={stats?.members} label="Neighbours on board" />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          How CrowdFix works
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Icon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h6" sx={{ mt: 1.5 }}>
                  {i + 1}. {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {body}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 8, mb: 3 }}>
          <Box>
            <Typography variant="h4">Needs attention now</Typography>
            <Typography color="text.secondary">Open issues with the most community support</Typography>
          </Box>
          <Button component={RouterLink} to="/issues">
            View all
          </Button>
        </Stack>
        {issues === null ? (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Skeleton variant="rounded" height={220} />
              </Grid>
            ))}
          </Grid>
        ) : issues.length ? (
          <Grid container spacing={3}>
            {issues.map((issue) => (
              <Grid item xs={12} sm={6} md={4} key={issue._id}>
                <IssueCard issue={issue} onChange={patch} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState
            title="No open issues yet"
            body="Be the first to put a local problem on the map."
            action={
              <Button component={RouterLink} to="/report" variant="contained">
                Report an issue
              </Button>
            }
          />
        )}
      </Container>
    </>
  );
}

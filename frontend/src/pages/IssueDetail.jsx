import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { api, errorMessage, getSocket } from '../api';
import { useAuth } from '../auth';
import { SOLUTION_KINDS, STATUSES, displayName, timeAgo } from '../constants';
import { CategoryLabel, SeverityDot, StatusChip, UpvoteButton } from '../components/IssueBits';

function StatusTimeline({ history }) {
  if (!history?.length) return null;
  return (
    <Stack spacing={2}>
      {history.map((h, i) => (
        <Stack key={i} direction="row" spacing={1.5}>
          <Box sx={{ mt: 0.75, width: 10, height: 10, borderRadius: '50%', bgcolor: h.status === 'resolved' ? 'success.main' : 'primary.main', flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {STATUSES[h.status]?.label || h.status}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {displayName(h.by)} · {timeAgo(h.at)}
            </Typography>
            {h.note && (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {h.note}
              </Typography>
            )}
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

function SolutionItem({ s, canAccept, onVote, onAccept, me }) {
  const own = me && s.user && String(s.user._id) === String(me._id);
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderColor: s.accepted ? 'success.main' : undefined, borderWidth: s.accepted ? 2 : 1 }}>
      <Stack direction="row" spacing={2}>
        <Stack alignItems="center" spacing={0}>
          <IconButton size="small" disabled={!me || own} color={s.myVote === 1 ? 'primary' : 'default'} onClick={() => onVote(s, s.myVote === 1 ? 0 : 1)}>
            <KeyboardArrowUpIcon />
          </IconButton>
          <Typography fontWeight={700}>{s.votes}</Typography>
          <IconButton size="small" disabled={!me || own} color={s.myVote === -1 ? 'primary' : 'default'} onClick={() => onVote(s, s.myVote === -1 ? 0 : -1)}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Stack>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip size="small" label={SOLUTION_KINDS[s.kind] || 'Proposed fix'} variant="outlined" />
            {s.accepted && <Chip size="small" color="success" icon={<CheckCircleIcon />} label="Accepted" />}
          </Stack>
          <Typography sx={{ mt: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{s.text}</Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              {displayName(s.user)}
              {s.user?.reputation ? ` (${s.user.reputation} pts)` : ''} · {timeAgo(s.createdAt)}
            </Typography>
            {canAccept && !s.accepted && (
              <Button size="small" onClick={() => onAccept(s)}>
                Accept this fix
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function IssueDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState('');
  const [reply, setReply] = useState({ text: '', kind: 'fix' });
  const [statusForm, setStatusForm] = useState({ status: '', note: '' });
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    () =>
      api
        .get(`/issues/${id}`)
        .then(({ data }) => {
          setIssue(data);
          setStatusForm((f) => ({ ...f, status: f.status || data.status }));
        })
        .catch((err) => setError(errorMessage(err))),
    [id]
  );

  useEffect(() => {
    load();
    const s = getSocket();
    s.emit('issue:watch', id);
    const refresh = (p) => (!p?.id || p.id === id || p.problem === id ? load() : null);
    ['solution:created', 'solution:voted', 'solution:accepted', 'issue:status'].forEach((e) => s.on(e, refresh));
    return () => {
      s.emit('issue:unwatch', id);
      ['solution:created', 'solution:voted', 'solution:accepted', 'issue:status'].forEach((e) => s.off(e, refresh));
    };
  }, [id, load]);

  const act = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (!issue)
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        {error ? <Alert severity="error">{error}</Alert> : <CircularProgress />}
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={RouterLink} to="/issues" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        All issues
      </Button>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <CategoryLabel category={issue.category} />
              <StatusChip status={issue.status} size="medium" />
            </Stack>
            <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 } }}>
              {issue.title}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
              <SeverityDot severity={issue.severity} />
              {(issue.city || issue.area) && (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
                  <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{[issue.area, issue.city].filter(Boolean).join(', ')}</Typography>
                </Stack>
              )}
              <Typography variant="caption" color="text.secondary">
                Reported by {displayName(issue.user)} · {timeAgo(issue.createdAt)}
              </Typography>
            </Stack>
            {issue.imageUrl && (
              <Box component="img" src={issue.imageUrl} alt="" sx={{ mt: 3, width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 2 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}
            <Typography sx={{ mt: 3, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}>{issue.description}</Typography>
            {issue.tags?.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
                {issue.tags.map((t) => (
                  <Chip key={t} size="small" label={`#${t}`} onClick={() => navigate(`/issues?q=${encodeURIComponent(t)}`)} />
                ))}
              </Stack>
            )}
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={2} alignItems="center">
              <UpvoteButton issue={issue} size="medium" onChange={(d) => setIssue({ ...issue, ...d })} />
              <Typography variant="body2" color="text.secondary">
                {issue.upvoteCount === 1 ? '1 person is affected' : `${issue.upvoteCount} people are affected`}
              </Typography>
            </Stack>
          </Paper>

          <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
            Fixes and updates ({issue.solutions.length})
          </Typography>
          <Stack spacing={2}>
            {issue.solutions.map((s) => (
              <SolutionItem
                key={s._id}
                s={s}
                me={user}
                canAccept={issue.canManage}
                onVote={(sol, value) => act(() => api.post(`/solutions/${sol._id}/vote`, { value }))}
                onAccept={(sol) => act(() => api.post(`/solutions/${sol._id}/accept`))}
              />
            ))}
            {!issue.solutions.length && (
              <Typography color="text.secondary">No fixes yet. Know who to call, or how to solve it? Share it below.</Typography>
            )}
          </Stack>

          <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
            {user ? (
              <Stack
                spacing={2}
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  act(async () => {
                    await api.post(`/issues/${id}/solutions`, reply);
                    setReply({ text: '', kind: reply.kind });
                  });
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>{displayName(user).charAt(0)}</Avatar>
                  <TextField select size="small" value={reply.kind} onChange={(e) => setReply({ ...reply, kind: e.target.value })} sx={{ minWidth: 200 }}>
                    {Object.entries(SOLUTION_KINDS).map(([k, v]) => (
                      <MenuItem key={k} value={k}>
                        {v}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <TextField
                  multiline
                  minRows={3}
                  placeholder="Who to contact, what worked elsewhere, or what has changed on the ground"
                  value={reply.text}
                  onChange={(e) => setReply({ ...reply, text: e.target.value })}
                />
                <Box>
                  <Button type="submit" variant="contained" disabled={busy || reply.text.trim().length < 10}>
                    Share
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Typography>
                <RouterLink to="/login">Sign in</RouterLink> to propose a fix or post an update.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
            {issue.canManage && (
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Update status
                </Typography>
                <Stack spacing={2}>
                  <TextField select size="small" value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}>
                    {Object.entries(STATUSES).map(([k, v]) => (
                      <MenuItem key={k} value={k}>
                        {v.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField size="small" multiline minRows={2} placeholder="What changed? (optional)" value={statusForm.note} onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })} />
                  <Button
                    variant="contained"
                    disabled={busy}
                    onClick={() =>
                      act(async () => {
                        await api.patch(`/issues/${id}/status`, statusForm);
                        setStatusForm({ status: statusForm.status, note: '' });
                      })
                    }
                  >
                    Save
                  </Button>
                  <Button
                    color="error"
                    size="small"
                    onClick={() =>
                      window.confirm('Delete this issue and all its replies?') &&
                      api.delete(`/issues/${id}`).then(() => navigate('/issues')).catch((err) => setError(errorMessage(err)))
                    }
                  >
                    Delete issue
                  </Button>
                </Stack>
              </Paper>
            )}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <StatusTimeline history={issue.statusHistory?.length ? issue.statusHistory : [{ status: 'reported', at: issue.createdAt, by: issue.user }]} />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

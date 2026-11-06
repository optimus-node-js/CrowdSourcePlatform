import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, Chip, Stack, Tooltip, Typography } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { CATEGORIES, SEVERITIES, STATUSES, displayName, timeAgo } from '../constants';
import { api, errorMessage } from '../api';
import { useAuth } from '../auth';

export function StatusChip({ status, size = 'small' }) {
  const s = STATUSES[status] || STATUSES.reported;
  return <Chip size={size} label={s.label} color={s.color} variant={status === 'reported' ? 'outlined' : 'filled'} />;
}

export function SeverityDot({ severity }) {
  const s = SEVERITIES[severity] || SEVERITIES.medium;
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {s.label} priority
      </Typography>
    </Stack>
  );
}

export function CategoryLabel({ category }) {
  const c = CATEGORIES[category] || CATEGORIES.other;
  const Icon = c.icon;
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'primary.dark' }}>
      <Icon sx={{ fontSize: 18 }} />
      <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {c.label}
      </Typography>
    </Stack>
  );
}

export function UpvoteButton({ issue, onChange, size = 'small' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post(`/issues/${issue._id}/upvote`);
      onChange?.(data);
    } catch (err) {
      alert(errorMessage(err));
    }
  };
  return (
    <Tooltip title={issue.hasUpvoted ? 'Remove your vote' : 'This affects me too'}>
      <Button
        size={size}
        onClick={toggle}
        variant={issue.hasUpvoted ? 'contained' : 'outlined'}
        startIcon={issue.hasUpvoted ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
        sx={{ minWidth: 0, borderRadius: 999 }}
      >
        {issue.upvoteCount ?? 0}
      </Button>
    </Tooltip>
  );
}

export function IssueCard({ issue, onChange }) {
  return (
    <Card sx={{ height: '100%', transition: 'border-color .15s', '&:hover': { borderColor: 'primary.light' } }}>
      <CardActionArea component={RouterLink} to={`/issues/${issue._id}`} sx={{ height: '100%', p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <CategoryLabel category={issue.category} />
          <StatusChip status={issue.status} />
        </Stack>
        <Typography variant="h6" sx={{ fontSize: 17, lineHeight: 1.35, mb: 0.75 }}>
          {issue.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}
        >
          {issue.description}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {(issue.city || issue.area) && (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary', mb: 1.5 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{[issue.area, issue.city].filter(Boolean).join(', ')}</Typography>
          </Stack>
        )}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={0.25}>
            <SeverityDot severity={issue.severity} />
            <Typography variant="caption" color="text.secondary">
              {displayName(issue.user)} · {timeAgo(issue.createdAt)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{issue.solutionCount || 0}</Typography>
            </Stack>
            <UpvoteButton issue={issue} onChange={onChange} />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2, border: '1px dashed #cbd5e1', borderRadius: 3, bgcolor: '#fff' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: action ? 3 : 0 }}>
        {body}
      </Typography>
      {action}
    </Box>
  );
}

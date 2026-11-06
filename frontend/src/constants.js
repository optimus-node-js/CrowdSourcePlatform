import ConstructionIcon from '@mui/icons-material/Construction';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ShieldIcon from '@mui/icons-material/Shield';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ParkIcon from '@mui/icons-material/Park';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const CATEGORIES = {
  roads: { label: 'Roads & potholes', icon: ConstructionIcon },
  water: { label: 'Water supply', icon: WaterDropIcon },
  electricity: { label: 'Electricity & streetlights', icon: BoltIcon },
  sanitation: { label: 'Garbage & sanitation', icon: DeleteSweepIcon },
  safety: { label: 'Public safety', icon: ShieldIcon },
  transport: { label: 'Public transport', icon: DirectionsBusIcon },
  environment: { label: 'Environment', icon: ParkIcon },
  'public-spaces': { label: 'Parks & public spaces', icon: ApartmentIcon },
  other: { label: 'Other', icon: HelpOutlineIcon },
};

export const STATUSES = {
  reported: { label: 'Reported', color: 'default' },
  acknowledged: { label: 'Acknowledged', color: 'info' },
  in_progress: { label: 'In progress', color: 'warning' },
  resolved: { label: 'Resolved', color: 'success' },
};

export const SEVERITIES = {
  low: { label: 'Low', color: '#64748b' },
  medium: { label: 'Medium', color: '#0284c7' },
  high: { label: 'High', color: '#ea580c' },
  critical: { label: 'Critical', color: '#dc2626' },
};

export const SOLUTION_KINDS = {
  fix: 'Proposed fix',
  update: 'Progress update',
  resource: 'Helpful resource',
};

export function displayName(user) {
  if (!user) return 'Former member';
  return user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Member';
}

export function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secs] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `${n} ${name}${n > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

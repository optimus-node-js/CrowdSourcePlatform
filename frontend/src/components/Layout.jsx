import { useState } from 'react';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { useAuth } from '../auth';
import { displayName } from '../constants';

const NAV = [
  { to: '/issues', label: 'Browse issues' },
  { to: '/dashboard', label: 'City dashboard' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

function Brand() {
  return (
    <Stack component={RouterLink} to="/" direction="row" alignItems="center" spacing={1} sx={{ textDecoration: 'none', color: 'inherit' }}>
      <Box component="img" src="/favicon.svg" alt="" sx={{ width: 30, height: 30 }} />
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
        CrowdFix
      </Typography>
    </Stack>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [anchor, setAnchor] = useState(null);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <IconButton sx={{ display: { md: 'none' } }} onClick={() => setDrawer(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
            <Brand />
            <Stack direction="row" spacing={0.5} sx={{ ml: 3, display: { xs: 'none', md: 'flex' } }}>
              {NAV.map((n) => (
                <Button
                  key={n.to}
                  component={NavLink}
                  to={n.to}
                  color="inherit"
                  sx={{ color: 'text.secondary', '&.active': { color: 'primary.main', bgcolor: 'rgba(15,118,110,0.08)' } }}
                >
                  {n.label}
                </Button>
              ))}
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" startIcon={<AddLocationAltIcon />} onClick={() => navigate('/report')} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              Report an issue
            </Button>
            {user ? (
              <>
                <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Account">
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 15 }}>{displayName(user).charAt(0)}</Avatar>
                </IconButton>
                <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} onClick={() => setAnchor(null)}>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography fontWeight={700}>{displayName(user)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.reputation} civic points
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => navigate('/profile')}>My reports and activity</MenuItem>
                  <MenuItem
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Sign out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={RouterLink} to="/login" color="inherit">
                Sign in
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer open={drawer} onClose={() => setDrawer(false)}>
        <Box sx={{ width: 260, p: 2 }} onClick={() => setDrawer(false)}>
          <Brand />
          <List sx={{ mt: 2 }}>
            {[{ to: '/report', label: 'Report an issue' }, ...NAV].map((n) => (
              <ListItemButton key={n.to} component={NavLink} to={n.to}>
                <ListItemText primary={n.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box component="footer" sx={{ borderTop: '1px solid #e2e8f0', py: 4, mt: 8, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              CrowdFix helps neighbours report, prioritise and resolve local problems together.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Built by{' '}
              <Link href="https://rahul-vishwakarma-portfolio.vercel.app/" target="_blank" rel="noreferrer">
                Rahul Vishwakarma
              </Link>{' '}
              ·{' '}
              <Link href="https://github.com/optimus-node-js/CrowdSourcePlatform" target="_blank" rel="noreferrer">
                Source
              </Link>
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

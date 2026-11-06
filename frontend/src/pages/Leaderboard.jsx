import { useEffect, useState } from 'react';
import { Alert, Avatar, Container, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { api, errorMessage } from '../api';

export default function Leaderboard() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/leaderboard')
      .then(({ data }) => setRows(data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4">Community leaderboard</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        Civic points: 2 for a report, 5 for a fix or update, +1 per upvote on your fix, 15 when your fix is accepted, 3 when your report gets resolved.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Neighbour</TableCell>
              <TableCell align="right">Reports</TableCell>
              <TableCell align="right">Fixes</TableCell>
              <TableCell align="right">Accepted</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows === null
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))
              : rows.map((r, i) => (
                  <TableRow key={r._id} hover>
                    <TableCell sx={{ fontWeight: 700, color: i < 3 ? 'primary.main' : 'text.secondary' }}>{i + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: 'primary.main' }}>{(r.name || '?').charAt(0)}</Avatar>
                        <div>
                          <Typography variant="body2" fontWeight={600}>
                            {r.name || 'Member'}
                          </Typography>
                          {r.city && (
                            <Typography variant="caption" color="text.secondary">
                              {r.city}
                            </Typography>
                          )}
                        </div>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{r.reports}</TableCell>
                    <TableCell align="right">{r.fixes}</TableCell>
                    <TableCell align="right">{r.acceptedFixes}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {r.reputation}
                    </TableCell>
                  </TableRow>
                ))}
            {rows?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No points earned yet. Report or fix something to get on the board.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

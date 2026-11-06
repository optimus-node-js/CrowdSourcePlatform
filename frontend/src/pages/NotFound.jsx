import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Typography variant="h3">Page not found</Typography>
      <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
        This street does not exist on our map.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Back home
      </Button>
    </Container>
  );
}

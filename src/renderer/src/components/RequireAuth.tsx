import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// adjust path
import { Box, Button, Typography } from '@mui/joy';

import { selectCurrentUser } from '../components/user/UsersSlice';

interface RequireAuthProps {
  children: ReactElement;
}

export default function RequireAuth({
  children,
}: RequireAuthProps): ReactElement {
  const navigate = useNavigate();
  const email = useSelector(selectCurrentUser);

  if (!email) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <Typography level="h3" color="danger" sx={{ mb: 2 }}>
          You must be logged in to view this page.
        </Typography>
        <Button
          color="primary"
          variant="solid"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Box>
    );
  }

  return children;
}

import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Input, Typography } from '@mui/joy';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import { setCurrentUser } from './UsersSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    dispatch(setCurrentUser(email));
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 2,
        py: 4,
      }}
    >
      <CustomBreadcrumbs />

      {/* Back Button */}
      <Box
        sx={{
          display: 'flex',
          my: 1,
          gap: 1,
          flexDirection: 'row',
          alignItems: 'end',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Button color="neutral" onClick={() => navigate('/')}>
          Back
        </Button>
      </Box>

      {/* Login Form Centered */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
          mt: 8,
        }}
        component="form"
        onSubmit={handleLogin}
      >
        <Typography level="h3">Login</Typography>

        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ minWidth: 300 }}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ minWidth: 300 }}
        />

        {error && (
          <Typography level="body-sm" color="danger">
            {error}
          </Typography>
        )}

        <Button type="submit" color="primary">
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;

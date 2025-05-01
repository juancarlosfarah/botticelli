import { FormEvent, startTransition, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Input, Typography } from '@mui/joy';

import { onLoginSuccess } from '@renderer/services/LoginService';
import { AppDispatch } from '@renderer/store';

import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }

    setError('');

    try {
      await onLoginSuccess(dispatch, email);
      navigate('/home');
    } catch (err) {
      console.error('[Login] Login failed:', err);
    }
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
        <Button color="neutral" onClick={() => navigate('/home')}>
          Back
        </Button>
      </Box>

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

'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { user, isSignedIn } = useUser();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            SkillUp AI
          </Link>
        </Typography>
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button color="inherit">Sign In</Button>
          </SignInButton>
        ) : (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Hello, {user?.firstName}
            </Typography>
            <UserButton />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

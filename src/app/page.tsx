'use client';
import React from "react";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const HomePage: React.FC = () => {
  const { user, isSignedIn } = useUser();

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Welcome to SkillUp AI
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#757de8' }}>
          Your AI-powered platform for personalized skill development.
        </Typography>
        <Typography variant="h6" component="p" gutterBottom sx={{ color: '#5c6bc0', mb: 4 }}>
          Whether you're a student or a professional, SkillUp AI helps you identify, track, and achieve your learning goals.
        </Typography>
        {isSignedIn && user ? (
          <>
            <Link href="/dashboard" passHref>
              <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/learning-paths" passHref>
              <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                View Learning Paths
              </Button>
            </Link>
            <Link href="/progress-tracker" passHref>
              <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                Track Progress
              </Button>
            </Link>
            <Link href="/skills-recommendation" passHref>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Recommended Skills
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/sign-in" passHref>
              <Button variant="contained" color="secondary" sx={{ mt: 2, mr: 2 }}>
                Get Started
              </Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
                Learn More
              </Button>
            </Link>
          </>
        )}
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 6, textAlign: 'center' }} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>Personalized Learning Paths</Typography>
              <Typography sx={{ color: '#5c6bc0' }}>
                Tailor your learning experience to your specific goals and track your progress with ease.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>AI-Powered Recommendations</Typography>
              <Typography sx={{ color: '#5c6bc0' }}>
                Get smart recommendations on skills to develop based on your profile and goals.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>Progress Tracking</Typography>
              <Typography sx={{ color: '#5c6bc0' }}>
                Visualize your learning journey and stay motivated by tracking your progress over time.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6, textAlign: 'center' }} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>Basic</Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#757de8' }}>$0 Month</Typography>
              <Typography gutterBottom sx={{ color: '#5c6bc0' }}>
                Access to basic features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>Pro</Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#757de8' }}>$4.99 / Month</Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#f44336' }}>Coming Soon</Typography>
              <Typography gutterBottom sx={{ color: '#5c6bc0' }}>
                Unlimited flashcards and storage for your flashcards.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;

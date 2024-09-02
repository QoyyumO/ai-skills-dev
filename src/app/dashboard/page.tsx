'use client';
import { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress, Grid } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase/firebaseConfig';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

interface Skill {
  skill: string;
  description: string;
}

interface Progress {
  learningPathId: string;
  progressPercentage: number;
  learningPathName?: string; // Holds the learning path name
}

export default function Dashboard() {
  const { user } = useUser();
  const [recommendedSkills, setRecommendedSkills] = useState<Skill[]>([]);
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendedSkills = async () => {
    if (!user) return;

    const skillsQuery = query(
      collection(db, 'suggestedSkills'),
      where('userId', '==', user.id)
    );

    const skillsSnapshot = await getDocs(skillsQuery);

    const skills = skillsSnapshot.docs.flatMap(doc => doc.data().skills || []);
    setRecommendedSkills(skills);
  };

  const fetchProgressData = async () => {
    if (!user) return;

    const progressQuery = query(
      collection(db, 'learningPathProgress'),
      where('userId', '==', user.id)
    );

    const progressSnapshot = await getDocs(progressQuery);

    const progress = await Promise.all(progressSnapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();

      // Fetch the learning path name based on the learningPathId
      const learningPathDocRef = doc(db, 'learningPaths', data.learningPathId);
      const learningPathDoc = await getDoc(learningPathDocRef);
      const learningPathName = learningPathDoc.exists() ? learningPathDoc.data()?.title : 'Unknown Path';

      return {
        learningPathId: data.learningPathId,
        progressPercentage: data.progressPercentage,
        learningPathName,
      };
    }));

    setProgressData(progress);
  };

  useEffect(() => {
    if (user) {
      fetchRecommendedSkills();
      fetchProgressData();
      setLoading(false);
    }
  }, [user]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.firstName}!
        </Typography>
        <Typography variant="body1">
          Here you can see your recommended skills and track your learning progress.
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {/* Display Recommended Skills */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Recommended Skills
            </Typography>
            {recommendedSkills.length > 0 ? (
              recommendedSkills.slice(0, 4).map((skill, index) => (
                <Box key={index} sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', mb: 2 }}>
                  <Typography variant="body1">{skill.skill}</Typography>
                  <Typography variant="body2" color="textSecondary">{skill.description}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1">No skills found.</Typography>
            )}
          </Grid>

          {/* Display Learning Progress */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Learning Progress
            </Typography>
            <Grid container spacing={2}>
              {progressData.map(progress => (
                <Grid item xs={12} sm={6} key={progress.learningPathId}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      p: 2,
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {progress.learningPathName}
                    </Typography>
                    <CircularProgress variant="determinate" value={progress.progressPercentage} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Progress: {progress.progressPercentage.toFixed(2)}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

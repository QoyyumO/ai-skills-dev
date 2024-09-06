'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, LinearProgress, Grid } from '@mui/material';
import { useAuth } from '@clerk/nextjs';
import { db } from '@/firebase/firebaseConfig';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

interface LearningPath {
  id: string;
  title: string;
}

interface LearningPathWithGoals {
  path: LearningPath;
  goals: Goal[];
  progressPercentage: number;
}

const ProgressTracker: React.FC = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [learningPathsWithGoals, setLearningPathsWithGoals] = useState<LearningPathWithGoals[]>([]);

  const fetchLearningPathsAndGoals = async () => {
    try {
      if (!userId) return;
  
      // Fetch learning paths
      const pathsQuery = query(
        collection(db, 'learningPaths'),
        where('userId', '==', userId)
      );
      const pathsSnapshot = await getDocs(pathsQuery);
      
      const learningPathsMap: Record<string, LearningPath> = {};
      
      pathsSnapshot.docs.forEach(doc => {
        const pathData = { id: doc.id, ...doc.data() } as LearningPath;
        learningPathsMap[doc.id] = pathData; // Store each path by its ID
      });
  
      const uniqueLearningPaths = Object.values(learningPathsMap); // Convert to array of unique paths
  
      // Initialize learning paths data
      const learningPathsData: LearningPathWithGoals[] = [];
  
      // Fetch goals for each learning path and calculate progress
      for (const path of uniqueLearningPaths) {
        const goalsQuery = query(
          collection(db, 'goals'),
          where('learningPathId', '==', path.id)
        );
        const goalsSnapshot = await getDocs(goalsQuery);
        const goals = goalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Goal[];
  
        const totalGoals = goals.length;
        const completedGoals = goals.filter(goal => goal.completed).length;
        const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  
        // Save the progress to Firestore
        await saveProgressToFirestore(userId!, path.id, progressPercentage);
  
        // Store data locally in the state
        learningPathsData.push({
          path,
          goals,
          progressPercentage,
        });
      }
  
      setLearningPathsWithGoals(learningPathsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching learning paths and goals");
      setLoading(false);
    }
  };
  
  

  // Global object to store locks
const locks: Record<string, boolean> = {};

const saveProgressToFirestore = async (
  userId: string,
  learningPathId: string,
  progressPercentage: number
) => {
  try {
    // Mutex lock to prevent multiple simultaneous writes
    const lockKey = `${userId}_${learningPathId}`;
    if (locks[lockKey]) return; // TypeScript knows `locks[lockKey]` is a boolean
    locks[lockKey] = true;

    // Check if progress already exists
    const progressQuery = query(
      collection(db, 'learningPathProgress'),
      where('userId', '==', userId),
      where('learningPathId', '==', learningPathId)
    );

    const progressSnapshot = await getDocs(progressQuery);

    if (progressSnapshot.empty) {
      // If no existing document, create a new one
      const progressRef = doc(collection(db, 'learningPathProgress'));
      await setDoc(progressRef, {
        userId,
        learningPathId,
        progressPercentage,
        timestamp: new Date().toISOString(),
      });
    } else {
      // If document exists, update the progressPercentage field
      const existingDoc = progressSnapshot.docs[0].ref; // Get the reference of the existing document
      await setDoc(existingDoc, { progressPercentage, timestamp: new Date().toISOString() }, { merge: true }); // Merge to update only the necessary fields
    }

    // Release the mutex lock
    delete locks[lockKey];
  } catch (error) {
    console.error("Error saving progress to Firestore");
  }
};

  
  

  useEffect(() => {
    fetchLearningPathsAndGoals();
  }, [userId]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Progress Tracker</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
              {learningPathsWithGoals.map(({ path, goals, progressPercentage }) => (
                <Grid item xs={12} key={`path-${path.id}`}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6">{path.title}</Typography>
                    <Typography variant="body2">Progress: {progressPercentage.toFixed(2)}%</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{ height: 20, borderRadius: '5px', mt: 1 }}
                    />
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {goals.map(goal => (
                        <Grid item xs={12} sm={6} key={`goal-${goal.id}`}>
                          <Box
                            sx={{
                              p: 2,
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              boxShadow: 2,
                            }}
                          >
                            <Typography variant="body1">
                              {goal.title} {goal.completed ? '✓' : '✗'}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>

        </Box>
      )}
    </Box>
  );
};

export default ProgressTracker;
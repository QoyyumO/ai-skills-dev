'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, TextField, Grid, IconButton, Checkbox } from '@mui/material';
import { useAuth } from '@clerk/nextjs';
import { db } from '@/firebase/firebaseConfig';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { signInWithCustomToken, getAuth } from 'firebase/auth';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  userId: string;
  suggestedCourses: string[];
  tutorials: string[];
  exercises: string[];
  goals: Goal[];
}

const LearningPaths: React.FC = () => {
  const { isSignedIn, getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathDescription, setNewPathDescription] = useState('');
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const fetchLearningPaths = async () => {
    if (!userId) return;
    const pathsQuery = query(
      collection(db, 'learningPaths'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(pathsQuery);
    const paths = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LearningPath[];
  
    // Fetch associated goals for each learning path
    const fetchGoals = async (pathId: string) => {
      const goalsQuery = query(
        collection(db, 'goals'),
        where('learningPathId', '==', pathId)
      );
      const goalsSnapshot = await getDocs(goalsQuery);
      return goalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Goal[];
    };
  
    const pathsWithGoals = await Promise.all(paths.map(async (path) => {
      const goals = await fetchGoals(path.id);
      return { ...path, goals };
    }));
  
    setLearningPaths(pathsWithGoals);
    setLoading(false);
  };

  useEffect(() => {
    const initializeFirebase = async () => {
      if (!isSignedIn) return;

      try {
        const token = await getToken({ template: 'integration_firebase' });
        const auth = getAuth();
        await signInWithCustomToken(auth, token || '');
        await fetchLearningPaths();
      } catch (error) {
        console.error("Error during Firebase initialization");
      }
    };

    initializeFirebase();
  }, [isSignedIn]);

  const fetchSuggestedCourses = async (title: string) => {
    try {
      const response = await fetch('/api/content-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggested courses');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching suggested courses");
      return { suggestedCourses: [], tutorials: [], exercises: [] };
    }
  };

  const deleteLearningPath = async (id: string) => {
    if (!userId) return;
    try {
      const pathRef = doc(db, 'learningPaths', id);
      await deleteDoc(pathRef);
      setLearningPaths((prevPaths) => prevPaths.filter(path => path.id !== id));
    } catch (error) {
      console.error('Error deleting learning path');
    }
  };
  const handleGoalCompletion = async (goalId: string, pathId: string, isCompleted: boolean) => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, { completed: isCompleted });
  
      // Update the goal in the component state
      setLearningPaths((prevPaths) =>
        prevPaths.map((path) =>
          path.id === pathId
            ? {
                ...path,
                goals: path.goals.map((goal) =>
                  goal.id === goalId ? { ...goal, completed: isCompleted } : goal
                ),
              }
            : path
        )
      );
    } catch (error) {
      console.error('Error updating goal completion');
    }
  };
  
  const deleteGoal = async (goalId: string, pathId: string) => {
    if (!userId) return;
    try {
      const goalRef = doc(db, 'goals', goalId);
      await deleteDoc(goalRef);
      setLearningPaths((prevPaths) =>
        prevPaths.map((path) =>
          path.id === pathId ? { ...path, goals: path.goals.filter((goal) => goal.id !== goalId) } : path
        )
      );
    } catch (error) {
      console.error('Error deleting goal');
    }
  };
  
  const addGoal = async (pathId: string, newGoalTitle: string) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'goals'), {
        learningPathId: pathId,
        title: newGoalTitle,
        completed: false,
      });
  
      // Refresh the learning paths to include the new goal
      await fetchLearningPaths();
    } catch (error) {
      console.error('Error adding goal');
    }
  };
  const addLearningPath = async () => {
    if (!userId || !newPathTitle || !newPathDescription) return;
  
    try {
      const courses = await fetchSuggestedCourses(newPathTitle);
      const { suggestedCourses, tutorials, exercises, goals } = courses;
  
      const docRef = await addDoc(collection(db, 'learningPaths'), {
        userId,
        title: newPathTitle,
        description: newPathDescription,
        createdAt: new Date(),
        suggestedCourses,
        tutorials,
        exercises,
      });
  
      // Create initial goals for the learning path
      await Promise.all(
        goals.map(async (goal: string) => {
          await addDoc(collection(db, 'goals'), {
            learningPathId: docRef.id,
            title: goal,
            completed: false,
          });
        })
      );
  
      setNewPathTitle('');
      setNewPathDescription('');
      await fetchLearningPaths();
    } catch (error) {
      console.error("Error adding learning path");
    }
  };
  


  return (
    <Box sx={{ p: 4 }}>
      {/* Add New Learning Path section */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#1976d2' }}>Add New Learning Path</Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={newPathTitle}
          onChange={(e) => setNewPathTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={newPathDescription}
          onChange={(e) => setNewPathDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addLearningPath}
          sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
        >
          Add Learning Path
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {learningPaths.length > 0 ? (
            learningPaths.map(path => (
              <Grid item xs={12} sm={6} key={path.id}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: 3,
                    transition: 'transform 0.2s, background-color 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      backgroundColor: '#f0f8ff',
                    },
                  }}
                >
                  <Typography variant="h6">{path.title}</Typography>
                  <Typography variant="body1">{path.description}</Typography>
                  
                  {/* Display Suggested Courses */}
                  <Typography variant="body2" sx={{ mt: 1 }}>Suggested Courses:</Typography>
                  <ul>
                    {Array.isArray(path.suggestedCourses) && path.suggestedCourses.length > 0 ? (
                      path.suggestedCourses.map((course: string, index: number) => (
                        <li key={index}>{course}</li>
                      ))
                    ) : (
                      <li>No suggested courses available.</li>
                    )}
                  </ul>
                  
                  {/* Display Tutorials */}
                  <Typography variant="body2">Tutorials:</Typography>
                  <ul>
                    {Array.isArray(path.tutorials) && path.tutorials.length > 0 ? (
                      path.tutorials.map((tutorial: string, index: number) => (
                        <li key={index}>{tutorial}</li>
                      ))
                    ) : (
                      <li>No tutorials available.</li>
                    )}
                  </ul>
                  
                  {/* Display Exercises */}
                  <Typography variant="body2">Exercises:</Typography>
                  <ul>
                    {Array.isArray(path.exercises) && path.exercises.length > 0 ? (
                      path.exercises.map((exercise: string, index: number) => (
                        <li key={index}>{exercise}</li>
                      ))
                    ) : (
                      <li>No exercises available.</li>
                    )}
                  </ul>

                  {/* Display Goals */}
                  <Typography variant="body2">Goals:</Typography>
                  <ul>
                    {Array.isArray(path.goals) && path.goals.length > 0 ? (
                      path.goals.map(goal => (
                        <li key={goal.id}>
                          <Checkbox
                            checked={goal.completed}
                            onChange={() => {
                              handleGoalCompletion(goal.id, path.id, !goal.completed);
                            }}
                          />
                          {goal.title}
                          <IconButton onClick={() => deleteGoal(goal.id, path.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </li>
                      ))
                    ) : (
                      <li>No goals available.</li>
                    )}
                  </ul>
                  <Box>
                    <TextField
                      label="New Goal"
                      variant="outlined"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      sx={{ mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addGoal(path.id, newGoalTitle)}
                    >
                      Add Goal
                    </Button>
                  </Box>
                  <IconButton color="error" onClick={() => deleteLearningPath(path.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography variant="body1">No learning paths available. Please add one!</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default LearningPaths;

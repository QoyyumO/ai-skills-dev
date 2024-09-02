'use client';
import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Button, TextField } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import SkillCard from '@/components/SkillCard';
import { db } from '@/firebase/firebaseConfig'; // Import your existing Firebase Firestore instance
import { collection, addDoc } from 'firebase/firestore';

export default function SkillRecommendations() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [recommendedSkills, setRecommendedSkills] = useState<{ skill: string; description: string }[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [courseName, setCourseName] = useState('');

  const handleGenerateSkills = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          courseName,
        }),
      });

      const data = await response.json();

      // Check for valid data structure
      if (data.skills && data.descriptions) {
        const skillsArray = data.skills.map((skill: string, index: number) => ({
          skill,
          description: data.descriptions[index] || '',
        }));
        setRecommendedSkills(skillsArray);

        // Save suggested skills to Firestore
        await saveSuggestedSkills(user.id, skillsArray); // Save skills to Firestore
      } else {
        console.error("Unexpected data format:", data);
        setRecommendedSkills([]);
      }

    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setRecommendedSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const saveSuggestedSkills = async (userId: string, skills: { skill: string; description: string }[]) => {
    try {
      const docRef = await addDoc(collection(db, 'suggestedSkills'), {
        userId,
        skills,
        createdAt: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Skill Recommendations</Typography>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleGenerateSkills(); }}>
        <TextField
          label="Job Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <TextField
          label="Course Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Generate Skills
        </Button>
      </Box>
      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        <Box sx={{ mt: 4 }}>
          {recommendedSkills.length > 0 ? (
            recommendedSkills.map((skillObj, index) => (
              <SkillCard key={index} skill={skillObj.skill} description={skillObj.description} />
            ))
          ) : (
            <Typography variant="body1">No skill recommendations available.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

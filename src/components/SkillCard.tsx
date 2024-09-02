// src/components/SkillCard.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface SkillCardProps {
  skill: string;
  description: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, description }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{skill}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SkillCard;

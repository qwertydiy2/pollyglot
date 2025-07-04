import React from 'react';

interface GradeResultProps {
  aiTranslation: string;
  userGuess: string;
  score: number;
}

export const GradeResult: React.FC<GradeResultProps> = ({ aiTranslation, userGuess, score }) => (
  <div style={{ margin: '1em 0', padding: '1em', border: '1px solid #ccc', borderRadius: 8 }}>
    <div><strong>AI Translation:</strong> {aiTranslation}</div>
    <div><strong>Your Guess:</strong> {userGuess}</div>
    <div><strong>Score:</strong> {score}%</div>
  </div>
);

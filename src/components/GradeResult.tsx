import React, { Suspense, lazy } from 'react';
const TextToImageButton = lazy(() => import('./TextToImageButton').then(m => ({ default: m.TextToImageButton })));

interface GradeResultProps {
  aiTranslation: string;
  userGuess: string;
  score: number;
}

export const GradeResult: React.FC<GradeResultProps> = ({ aiTranslation, userGuess, score }) => (
  <div style={{ margin: '1em 0', padding: '1em', border: '1px solid #ccc', borderRadius: 8 }}>
    <div>
      <strong>AI Translation:</strong> {aiTranslation}
      {aiTranslation.trim() && (
        <Suspense fallback={null}>
          <TextToImageButton prompt={aiTranslation} style={{ marginLeft: 8 }} enabled={true} />
        </Suspense>
      )}
    </div>
    <div>
      <strong>Your Guess:</strong> {userGuess}
      {userGuess.trim() && (
        <Suspense fallback={null}>
          <TextToImageButton prompt={userGuess} style={{ marginLeft: 8 }} enabled={true} />
        </Suspense>
      )}
    </div>
    <div><strong>Score:</strong> {score}%</div>
  </div>
);

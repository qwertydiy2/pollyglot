import { useNavigate } from 'react-router-dom';
import Settings from './Settings';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="techno-card" style={{ maxWidth: 700, margin: '2rem auto', position: 'relative', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: 500, minWidth: 0, margin: '0 auto', textAlign: 'center' }}>
        <h1 className="techno-title" style={{ marginBottom: 8, wordBreak: 'break-word', fontSize: '2.2em' }}>PollyGlot</h1>
        <p style={{ fontSize: 18, color: 'var(--techno-muted)', marginBottom: 24 }}>Welcome! Choose an experience:</p>
        <div className="d-flex flex-column gap-3" style={{ gap: 16 }}>
          <button className="techno-btn" style={{ fontSize: 18 }} onClick={() => navigate('/grader')}>Grader</button>
          <button className="techno-btn" style={{ fontSize: 18 }} onClick={() => navigate('/chat')}>Chat</button>
          <button className="techno-btn" style={{ fontSize: 18 }} onClick={() => navigate('/history')}>History</button>
        </div>
        <div style={{ marginTop: 32, color: 'var(--techno-muted)', fontSize: 14 }}>
          <strong>PollyGlot</strong> is a multilingual translation and grading tool.<br />
          Powered by OpenAI GPT-4o. All logic runs in your browser.
        </div>
        {/* Settings Section */}
        <div style={{ marginTop: 40, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
          <Settings />
        </div>
      </div>
    </div>
  );
}

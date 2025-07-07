import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import _ from 'lodash';
import { loadHistoryFromLocalStorage } from '../utils/storage';

/**
 * HistoryView: shows all saved sessions and allows restoring them.
 */
export default function HistoryView() {
  const navigate = useNavigate();
  const [history] = useState(() => loadHistoryFromLocalStorage());
  // Restore a session by saving it to localStorage and navigating to Grader
  const restore = (state: object) => {
    localStorage.setItem('pollyglot_state', JSON.stringify(_.cloneDeep(state)));
    navigate('/grader');
  };
  return (
    <div className="techno-card" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2 className="techno-title">History</h2>
      {history.length === 0 && <p>No history yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {_.cloneDeep(history).reverse().map((entry: { timestamp: number, state: any }, i: number) => (
          <li key={i} style={{ marginBottom: 16, background: 'rgba(44,46,70,0.7)', borderRadius: 10, padding: 16, color: 'var(--techno-text)', boxShadow: '0 2px 8px #7f5af022' }}>
            <div style={{ fontSize: 13, color: 'var(--techno-muted)' }}>{new Date(entry.timestamp).toLocaleString()}</div>
            <button className="techno-btn" style={{ marginTop: 4, marginBottom: 8 }} onClick={() => restore(entry.state)}>Restore</button>
            <div style={{ fontSize: 15, margin: '8px 0' }}>
              <div><strong>Input:</strong> {entry.state.input || <span style={{ color: '#888' }}>—</span>}</div>
              <div><strong>From:</strong> {entry.state.sourceLang || <span style={{ color: '#888' }}>—</span>}</div>
              <div><strong>To:</strong> {entry.state.targetLang || <span style={{ color: '#888' }}>—</span>}</div>
              <div><strong>AI Translation:</strong> <span style={{ color: 'var(--techno-accent2)' }}>{entry.state.aiTranslation || <span style={{ color: '#888' }}>—</span>}</span></div>
              <div><strong>Your Guess:</strong> {entry.state.userGuess || <span style={{ color: '#888' }}>—</span>}</div>
              <div><strong>Score:</strong> {typeof entry.state.score === 'number' ? `${entry.state.score}%` : <span style={{ color: '#888' }}>—</span>}</div>
            </div>
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: 'pointer', color: 'var(--techno-accent)', fontSize: 13 }}>Show full session JSON</summary>
              <pre style={{ fontSize: 12, marginTop: 4, whiteSpace: 'pre-wrap', color: 'var(--techno-muted)', background: 'rgba(0,0,0,0.08)', borderRadius: 6, padding: 8 }}>{JSON.stringify(Object.fromEntries(Object.entries(entry.state).filter(([k]) => k !== 'apiKey' && k !== 'ghKey')), null, 2)}</pre>
            </details>
          </li>
        ))}
      </ul>
      <button
        className="techno-btn"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: '0.3em 0.7em'
        }}
        onClick={() => navigate('/')}
        aria-label="Back to Landing"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polyline points="15 18 9 12 15 6"></polyline></svg>
        <span style={{ fontSize: '1em', fontWeight: 500 }}>Back</span>
      </button>
    </div>
  );
}

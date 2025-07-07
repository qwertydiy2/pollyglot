import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  // Settings state
  const [provider, setProvider] = useState(localStorage.getItem('pollyglot_provider') || 'OpenAI');
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [ghKey, setGhKey] = useState(localStorage.getItem('gh_models_key') || '');
  const [saved, setSaved] = useState(false);

  const saveKeys = () => {
    localStorage.setItem('pollyglot_provider', provider);
    if (provider === 'OpenAI') {
      localStorage.setItem('openai_api_key', apiKey);
    } else {
      localStorage.setItem('gh_models_key', ghKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        <div style={{ marginTop: 40, background: 'rgba(44,46,70,0.7)', borderRadius: 12, padding: 24, textAlign: 'left', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', boxShadow: '0 2px 12px #7f5af022' }}>
          <h2 className="techno-title" style={{ fontSize: '1.3em', marginBottom: 12, textAlign: 'center' }}>Settings</h2>
          <label className="techno-label" htmlFor="provider-toggle">Provider:</label>
          <select
            id="provider-toggle"
            className="techno-select w-100"
            value={provider}
            onChange={e => setProvider(e.target.value)}
          >
            <option value="OpenAI">OpenAI</option>
            <option value="GitHub Models">GitHub Models</option>
          </select>
          {provider === 'OpenAI' && (
            <>
              <label className="techno-label" htmlFor="api-key">OpenAI API Key:</label>
              <input
                id="api-key"
                type="password"
                className="techno-input w-100"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                autoComplete="off"
              />
            </>
          )}
          {provider === 'GitHub Models' && (
            <>
              <label className="techno-label" htmlFor="gh-key">GitHub Models Key:</label>
              <input
                id="gh-key"
                type="password"
                className="techno-input w-100"
                value={ghKey}
                onChange={e => setGhKey(e.target.value)}
                autoComplete="off"
              />
            </>
          )}
          <button className="techno-btn w-100" style={{ marginTop: 16 }} onClick={saveKeys}>Save</button>
          {saved && <div style={{ color: 'var(--techno-accent2)', marginTop: 8 }}>Settings saved!</div>}
          <div className="techno-muted" style={{ marginTop: 18, fontSize: 13 }}>
            Your API keys are stored securely in your browser and never sent anywhere except OpenAI or GitHub Models.
          </div>
        </div>
      </div>
    </div>
  );
}

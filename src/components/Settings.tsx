import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
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
    <div className="techno-card" style={{ maxWidth: 500, margin: '2rem auto', position: 'relative', width: '100%' }}>
      <button
        className="techno-btn"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: '0.3em 0.7em',
          fontSize: '1.1em',
          display: 'flex',
          alignItems: 'center',
          background: 'none',
          color: 'var(--techno-accent, #7f5af0)',
          boxShadow: 'none',
          border: 'none',
          zIndex: 10
        }}
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polyline points="15 18 9 12 15 6"></polyline></svg>
        <span style={{ fontSize: '1em', fontWeight: 500 }}>Back</span>
      </button>
      <h2 className="techno-title" style={{ marginBottom: 16 }}>Settings</h2>
      <div style={{ width: '100%', maxWidth: 400, minWidth: 0, margin: '0 auto' }}>
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
        <div className="techno-muted" style={{ marginTop: 24, fontSize: 13 }}>
          Your API keys are stored securely in your browser and never sent anywhere except OpenAI or GitHub Models.
        </div>
      </div>
    </div>
  );
}

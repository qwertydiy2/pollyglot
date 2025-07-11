import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  // Normalize provider value to match select options
  const getProvider = () => {
    const raw = localStorage.getItem('pollyglot_provider');
    if (!raw) return 'OpenAI';
    if (raw === 'OpenAI' || raw === 'GitHub Models' || raw === 'Stablecog') return raw;
    if (raw.toLowerCase().includes('stablecog')) return 'Stablecog';
    if (raw.toLowerCase().includes('github')) return 'GitHub Models';
    return 'OpenAI';
  };
  const [provider, setProvider] = useState(getProvider());
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [ghKey, setGhKey] = useState(localStorage.getItem('gh_models_key') || '');
  const [scKey, setScKey] = useState(localStorage.getItem('sc_api_key') || '');
  const [saved, setSaved] = useState(false);

  const saveKeys = () => {
    // Save chat provider keys
    localStorage.setItem('pollyglot_provider', provider);
    if (provider === 'OpenAI') {
      localStorage.setItem('openai_api_key', apiKey);
    } else if (provider === 'GitHub Models') {
      localStorage.setItem('gh_models_key', ghKey);
    } else if (provider === 'Stablecog') {
      localStorage.setItem('sc_api_key', scKey);
    }
    // Always save image API key, independent of provider
    localStorage.setItem('sc_api_key', scKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="techno-card" style={{ maxWidth: 500, margin: '2rem auto', position: 'relative', width: '100%', overflowY: 'auto', maxHeight: '100vh' }}>
      <h2 className="techno-title" style={{ marginBottom: 16 }}>Settings</h2>
      <div style={{ width: '100%', maxWidth: 400, minWidth: 0, margin: '0 auto' }}>
        <label className="techno-label" htmlFor="provider-toggle">Provider:</label>
        <select
          id="provider-toggle"
          className="techno-select w-100"
          value={provider}
          onChange={e => {
            setProvider(e.target.value);
            localStorage.setItem('pollyglot_provider', e.target.value);
          }}
        >
          <option value="OpenAI">OpenAI</option>
          <option value="GitHub Models">GitHub Models</option>
          <option value="Stablecog">Stablecog</option>
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
            <label className="techno-label" htmlFor="gh-key" style={{ marginTop: 12 }}>GitHub Models Key:</label>
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
        {provider === 'Stablecog' && (
          <>
            <label className="techno-label" htmlFor="sc-key" style={{ color: '#7f5af0', fontWeight: 600 }}>Stablecog API Key:</label>
            <input
              id="sc-key"
              type="password"
              className="techno-input w-100"
              style={{ marginTop: 6, background: '#181825', color: '#fff', border: '1px solid #7f5af0' }}
              value={scKey}
              onChange={e => {
                setScKey(e.target.value);
                localStorage.setItem('sc_api_key', e.target.value);
              }}
              autoComplete="off"
              placeholder="Enter your Stablecog API key"
            />
          </>
        )}
        <label className="techno-label" htmlFor="image-model-select" style={{ marginTop: 12 }}>Image Model:</label>
        <select
          id="image-model-select"
          className="techno-select w-100"
          value={localStorage.getItem('image_model_idx') || '0'}
          onChange={e => localStorage.setItem('image_model_idx', e.target.value)}
        >
          <option value="0">FLUX.1</option>
          <option value="1">Stable Diffusion 3</option>
          <option value="2">Kandinsky 2.2</option>
          <option value="3">SDXL</option>
          <option value="4">SSD-1B</option>
          <option value="5">Kandinsky</option>
          <option value="6">Luna Diffusion</option>
          <option value="7">Stable Diffusion</option>
          <option value="8">Openjourney</option>
          <option value="9">Waifu Diffusion</option>
          <option value="10">22h Diffusion</option>
          <option value="11">Arcane Diffusion</option>
          <option value="12">Redshift Diffusion</option>
          <option value="13">Ghibli Diffusion</option>
        </select>
        <button className="techno-btn w-100" style={{ marginTop: 16 }} onClick={saveKeys}>Save</button>
        {saved && <div style={{ color: 'var(--techno-accent2)', marginTop: 8 }}>Settings saved!</div>}
        <div className="techno-muted" style={{ marginTop: 24, fontSize: 13 }}>
          Your API keys are stored securely in your browser and never sent anywhere except OpenAI, GitHub Models, or Stablecog.
        </div>
      </div>
    </div>
  );
}

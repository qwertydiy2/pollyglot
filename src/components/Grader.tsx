import { useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { PollyGlotApp } from '../App';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { saveStateToLocalStorage, loadStateFromLocalStorage, saveStateToHistory } from '../utils/storage';

/**
 * Grader page: main translation and grading interface.
 * Persists state to localStorage and history on every change.
 */
export default function Grader() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to get translation text from Redux state
  const getTranslationText = () => {
    const state = store.getState().pollyglot;
    return state?.currentTranslation || '';
  };

  // Map dropdown index to Stablecog model_id
  const modelIdMap = [
    'flux-1', // FLUX.1
    'stable-diffusion-3', // Stable Diffusion 3
    'kandinsky-2.2', // Kandinsky 2.2
    'sdxl', // SDXL
    'ssd-1b', // SSD-1B
    'kandinsky', // Kandinsky
    'luna-diffusion', // Luna Diffusion
    'stable-diffusion', // Stable Diffusion
    'openjourney', // Openjourney
    'waifu-diffusion', // Waifu Diffusion
    '22h-diffusion', // 22h Diffusion
    'arcane-diffusion', // Arcane Diffusion
    'redshift-diffusion', // Redshift Diffusion
    'ghibli-diffusion', // Ghibli Diffusion
  ];

  // Image generation handler
  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const scKey = localStorage.getItem('sc_api_key') || '';
      const modelIdx = parseInt(localStorage.getItem('image_model_idx') || '0', 10);
      const prompt = getTranslationText();
      const model_id = modelIdMap[modelIdx] || modelIdMap[0];
      const API_URL = 'https://api.stablecog.com/v1/image/generation/create';
      const reqBody = {
        prompt,
        model_id,
        width: 512,
        height: 512,
        num_outputs: 1,
        guidance_scale: 7,
        inference_steps: 30
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${scKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      });
      if (!response.ok) throw new Error('Image generation failed');
      const data = await response.json();
      setImageUrl(data.outputs?.[0]?.url || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Save state to localStorage and history on every change
    const unsubscribe = store.subscribe(() => {
      const state = store.getState().pollyglot;
      saveStateToLocalStorage(state);
      saveStateToHistory(state);
    });
    // Load state from localStorage on mount
    const saved = loadStateFromLocalStorage();
    if (saved) {
      store.dispatch({ type: 'pollyglot/loadState', payload: _.cloneDeep(saved) });
    }
    return () => unsubscribe();
  }, []);
  return (
    <div className="techno-card" style={{ maxWidth: 700, margin: '2rem auto', position: 'relative', minHeight: '80vh', width: '100%' }}>
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
        onClick={() => navigate('/')}
        aria-label="Back to Landing"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polyline points="15 18 9 12 15 6"></polyline></svg>
        <span style={{ fontSize: '1em', fontWeight: 500 }}>Back</span>
      </button>
      <div style={{ width: '100%', maxWidth: 500, minWidth: 0, margin: '0 auto' }}>
        <Provider store={store}>
          <PollyGlotApp />
        </Provider>
        {/* Image generation UI */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button className="techno-btn" onClick={generateImage} disabled={loading} style={{ marginBottom: 12 }}>
            {loading ? 'Generating Image...' : 'Generate Image from Translation'}
          </button>
          {error && <div style={{ color: '#ff4f4f', marginTop: 8 }}>{error}</div>}
          {imageUrl && (
            <div style={{ marginTop: 16 }}>
              <img src={imageUrl} alt="Generated visual" style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 12px #7f5af044' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

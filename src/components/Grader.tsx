import { useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { PollyGlotApp } from '../App';
import { useEffect } from 'react';
import _ from 'lodash';
import { saveStateToLocalStorage, loadStateFromLocalStorage, saveStateToHistory } from '../utils/storage';

/**
 * Grader page: main translation and grading interface.
 * Persists state to localStorage and history on every change.
 */
export default function Grader() {
  const navigate = useNavigate();
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
      </div>
    </div>
  );
}

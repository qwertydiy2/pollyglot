
import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { LanguageSelector } from './components/LanguageSelector';
import { GradeResult } from './components/GradeResult';
import { gradeTranslation } from './components/grader';
import './techno-romantic.scss';
import OpenAI from 'openai';

const GITHUB_MODELS_API_URL = "https://models.github.ai/inference";

// Enhanced system prompt for best translation quality and clarity
function getSystemPrompt(source: string, target: string): string {
  return [
    'You are PollyGlot, a world-class, unbiased, and context-aware translation assistant.',
    'Your job is to translate text from the source language to the target language as accurately and naturally as possible.',
    'Always use correct grammar, idioms, and natural phrasing for the target language.',
    'If the input is ambiguous, choose the most common or neutral interpretation.',
    'Never explain, never apologize, never repeat the input, and never output anything except the translation itself.',
    'Do not include language names, notes, or any extra text.',
    `Source language: ${source}.`,
    `Target language: ${target}.`,
    'Input will follow. Output only the translation.'
  ].join(' ');
}

// Main Redux-powered App
function PollyGlotApp() {
  const dispatch = useAppDispatch();
  const {
    sourceLang,
    targetLang,
    input,
    aiTranslation,
    userGuess,
    score,
    loading,
    apiKey,
    ghKey,
    provider,
    
    error,
  } = useAppSelector(state => state.pollyglot);
  useEffect(() => {
    dispatch({ type: 'pollyglot/setApiKey', payload: localStorage.getItem('openai_api_key') || '' });
    dispatch({ type: 'pollyglot/setGhKey', payload: localStorage.getItem('gh_models_key') || '' });
    const savedProvider = localStorage.getItem('pollyglot_provider');
    if (savedProvider) {
      dispatch({ type: 'pollyglot/setProvider', payload: savedProvider });
    }
  }, [dispatch]);

  const handleTranslate = async () => {
    dispatch({ type: 'pollyglot/setError', payload: '' });
    dispatch({ type: 'pollyglot/setLoading', payload: true });
    dispatch({ type: 'pollyglot/setAiTranslation', payload: '' });
    dispatch({ type: 'pollyglot/setScore', payload: null });
    try {
      let translation = '';
      if (provider === 'OpenAI') {
        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: getSystemPrompt(sourceLang, targetLang) },
            { role: 'user', content: input },
          ],
          max_tokens: 256,
        });
        translation = completion.choices?.[0]?.message?.content?.trim() || '';
      } else {
        const openai = new OpenAI({
          apiKey: ghKey,
          baseURL: GITHUB_MODELS_API_URL,
          dangerouslyAllowBrowser: true
        });
        const completion = await openai.chat.completions.create({
          model: 'openai/gpt-4o',
          messages: [
            { role: 'system', content: getSystemPrompt(sourceLang, targetLang) },
            { role: 'user', content: input },
          ],
          max_tokens: 256,
        });
        translation = completion.choices?.[0]?.message?.content?.trim() || '';
      }
      dispatch({ type: 'pollyglot/setAiTranslation', payload: translation });
      if (userGuess) dispatch({ type: 'pollyglot/setScore', payload: gradeTranslation(translation, userGuess) });
    } catch (e) {
      const err = (e && typeof e === 'object' && 'message' in e) ? (e as { message?: string }) : undefined;
      dispatch({ type: 'pollyglot/setError', payload: err?.message || (typeof e === 'string' ? e : 'Unknown error') });
    } finally {
      dispatch({ type: 'pollyglot/setLoading', payload: false });
    }
  };

  const handleGrade = () => {
    if (aiTranslation && userGuess) {
      dispatch({ type: 'pollyglot/setScore', payload: gradeTranslation(aiTranslation, userGuess) });
    }
  };

  return (
    <div className="techno-card" role="main">
      <h1 className="techno-title">PollyGlot Translator</h1>
      {/* API Key Section */}
      <section className="mb-3 w-100">
        <div className="d-flex flex-column gap-2 w-100">
          <div className="d-flex flex-row align-items-center gap-2 w-100">
            <label className="techno-label mb-0 me-2" htmlFor="provider-toggle">Provider:</label>
            <select
              id="provider-toggle"
              className="techno-select flex-fill"
              value={provider}
              onChange={e => {
                const value = e.target.value;
                dispatch({ type: 'pollyglot/setProvider', payload: value });
                localStorage.setItem('pollyglot_provider', value);
              }}
              aria-label="Provider"
              style={{ minWidth: 0 }}
            >
              <option value="OpenAI">OpenAI</option>
              <option value="GitHub Models">GitHub Models</option>
            </select>
          </div>
          {provider === 'OpenAI' && (
            <div className="d-flex flex-row align-items-center gap-2 w-100">
              <label className="techno-label mb-0 me-2" htmlFor="api-key">OpenAI API Key:</label>
              <input
                id="api-key"
                type="password"
                className="techno-input flex-fill"
                value={apiKey}
                onChange={e => dispatch({ type: 'pollyglot/setApiKey', payload: e.target.value })}
                aria-label="OpenAI API Key"
                style={{ minWidth: 0 }}
              />
              <button onClick={() => { localStorage.setItem('openai_api_key', apiKey); alert('OpenAI key saved!'); }} className="techno-btn ms-2" style={{ whiteSpace: 'nowrap' }}>Save</button>
            </div>
          )}
          {provider === 'GitHub Models' && (
            <div className="d-flex flex-row align-items-center gap-2 w-100">
              <label className="techno-label mb-0 me-2" htmlFor="gh-key">GitHub Models Key:</label>
              <input
                id="gh-key"
                type="password"
                className="techno-input flex-fill"
                value={ghKey}
                onChange={e => dispatch({ type: 'pollyglot/setGhKey', payload: e.target.value })}
                aria-label="GitHub Models Key"
                style={{ minWidth: 0 }}
              />
              <button onClick={() => { localStorage.setItem('gh_models_key', ghKey); alert('GitHub Models key saved!'); }} className="techno-btn ms-2" style={{ whiteSpace: 'nowrap' }}>Save</button>
            </div>
          )}
        </div>
      </section>

      {/* Language Selection */}
      <section className="d-flex gap-3 mb-3 flex-row flex-wrap justify-content-center align-items-end w-100">
        <div className="flex-fill" style={{ minWidth: 0 }}>
          <LanguageSelector label="From:" value={sourceLang} onChange={lang => dispatch({ type: 'pollyglot/setSourceLang', payload: lang })} />
        </div>
        <div className="flex-fill" style={{ minWidth: 0 }}>
          <LanguageSelector label="To:" value={targetLang} onChange={lang => dispatch({ type: 'pollyglot/setTargetLang', payload: lang })} />
        </div>
      </section>

      {/* Input Area */}
      <section>
        <label className="techno-label" htmlFor="input-text">Text to translate:</label>
        <textarea
          id="input-text"
          className="techno-textarea"
          value={input}
          onChange={e => dispatch({ type: 'pollyglot/setInput', payload: e.target.value })}
          placeholder="Enter text here..."
          rows={3}
          aria-label="Text to translate"
        />
        <button
          onClick={handleTranslate}
          disabled={
            loading ||
            !input ||
            (provider === 'OpenAI' ? !apiKey : !ghKey)
          }
          className="techno-btn w-100 mb-3"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </section>

      {/* AI Translation Output */}
      {aiTranslation && (
        <section>
          <label className="techno-label" htmlFor="ai-translation">AI Translation:</label>
          <textarea
            id="ai-translation"
            className="techno-textarea"
            value={aiTranslation}
            onChange={() => {}}
            rows={3}
            aria-label="AI Translation"
            readOnly
          />
        </section>
      )}

      {/* User Guess Input */}
      <section>
        <label className="techno-label" htmlFor="user-guess">Your Guess:</label>
        <textarea
          id="user-guess"
          className="techno-textarea"
          value={userGuess}
          onChange={e => dispatch({ type: 'pollyglot/setUserGuess', payload: e.target.value })}
          placeholder="Enter your translation guess..."
          rows={3}
          aria-label="Your translation guess"
        />
        <button onClick={handleGrade} disabled={!aiTranslation || !userGuess} className="techno-btn w-100 mb-3">
          Grade My Guess
        </button>
      </section>

      {/* Grading Result */}
      {score !== null && aiTranslation && (
        <div className="techno-result" aria-live="polite">
          <GradeResult aiTranslation={aiTranslation} userGuess={userGuess} score={score} />
        </div>
      )}

      {/* Provider Warning */}
      {provider === 'GitHub Models' && GITHUB_MODELS_API_URL.includes('github.com') && (
        <div style={{ color: '#ffb347', marginTop: 8 }}>
          ⚠️ Please set the correct endpoint for your GitHub Model provider in <code>GITHUB_MODELS_API_URL</code> in <code>App.tsx</code>.
        </div>
      )}

      {/* Error Message */}
      {error && <div style={{ color: '#ff3860', marginTop: 16 }}>{error}</div>}

      {/* Footer */}
      <div className="techno-muted">
        Powered by OpenAI GPT-4o. No data is stored. All logic runs in your browser.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PollyGlotApp />
    </Provider>
  );
}

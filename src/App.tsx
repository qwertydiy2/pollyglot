import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect, useState } from 'react';
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
export function PollyGlotApp() {
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
  const [showSent, setShowSent] = useState(false);
  const [openaiModel, setOpenaiModel] = useState(() => localStorage.getItem('openai_model') || 'gpt-4o');
  useEffect(() => {
    setOpenaiModel(localStorage.getItem('openai_model') || 'gpt-4o');
  }, [provider]);
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
    setShowSent(false);
    // Check for missing key and show error
    if ((provider === 'OpenAI' && !apiKey) || (provider === 'GitHub Models' && !ghKey)) {
      dispatch({ type: 'pollyglot/setError', payload: 'No API key configured. Please go to Settings and add your key.' });
      dispatch({ type: 'pollyglot/setLoading', payload: false });
      return;
    }
    try {
      let translation = '';
      if (provider === 'OpenAI') {
        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });
        const completion = await openai.chat.completions.create({
          model: openaiModel,
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
      setShowSent(true);
      setTimeout(() => setShowSent(false), 2000);
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
        {showSent && (
          <div style={{ color: 'var(--techno-accent2)', margin: '12px 0', fontWeight: 600, textAlign: 'center' }}>Translation sent!</div>
        )}
      </section>

      {/* AI Translation Output */}
      {aiTranslation && (
        <section>
          <label className="techno-label" htmlFor="ai-translation">AI Translation:</label>
          <div style={{ background: 'rgba(44,46,70,0.7)', borderRadius: 8, padding: '1em', margin: '0.5em 0 1em 0', color: 'var(--techno-text)', fontSize: '1.15em', wordBreak: 'break-word', boxShadow: '0 2px 8px #7f5af022' }}>
            {aiTranslation}
          </div>
          <textarea
            id="ai-translation"
            className="techno-textarea"
            value={aiTranslation}
            onChange={() => {}}
            rows={3}
            aria-label="AI Translation"
            readOnly
            style={{ display: 'none' }}
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

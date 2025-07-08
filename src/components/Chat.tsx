import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { useSelector, useDispatch } from 'react-redux';
import { setSourceLang, setTargetLang } from '../store';
import { LanguageSelector } from './LanguageSelector';
import type { Language } from './LanguageSelector';
import { jaccardSimilarity } from './grader';

const SYSTEM_PROMPT = `You are PollyGlot, a friendly, unbiased, and context-aware translation chat assistant for active language learners. 
- Respond naturally and helpfully, using only the target language when translating or giving answers.
- For exercises, generate realistic, level-appropriate translation or comprehension tasks (CEFR for English/French, HSK for Chinese) without mentioning the grading system or language level names.
- When grading, be objective and concise. Use the Jaccard similarity method to compare user answers to ideal answers, but do not mention the method by name. Give a percentage score and a short, actionable tip for improvement.
- Do not include language names, grading method names, or extra notes unless specifically asked.
- Always encourage the user to keep practicing and provide positive, constructive feedback.`;

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    { role: 'assistant', content: 'Hello! How can I help you with translation today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const apiKey = localStorage.getItem('openai_api_key') || '';
  const provider = localStorage.getItem('pollyglot_provider') || 'OpenAI';
  const model = localStorage.getItem('openai_model') || 'gpt-4o';
  const ghKey = localStorage.getItem('gh_models_key') || '';
  const dispatch = useDispatch();
  const sourceLang: Language = useSelector((state: { pollyglot: { sourceLang: Language } }) => state.pollyglot.sourceLang) || (localStorage.getItem('pollyglot_sourceLang') as Language) || 'English';
  const targetLang: Language = useSelector((state: { pollyglot: { targetLang: Language } }) => state.pollyglot.targetLang) || (localStorage.getItem('pollyglot_targetLang') as Language) || 'French';

  // Exercise state
  const [exerciseMode, setExerciseMode] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(5);
  const [exerciseDifficulty, setExerciseDifficulty] = useState('B1');
  const [exercises, setExercises] = useState<string[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [grading, setGrading] = useState(false);
  const [grades, setGrades] = useState<number[]>([]);
  const [report, setReport] = useState<string>('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Persist language selection to localStorage
    localStorage.setItem('pollyglot_sourceLang', sourceLang);
    localStorage.setItem('pollyglot_targetLang', targetLang);
  }, [sourceLang, targetLang]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);
    try {
      let openai;
      const usedModel = model;
      if (provider === 'OpenAI') {
        openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      } else {
        openai = new OpenAI({ apiKey: ghKey, baseURL: 'https://models.github.ai/inference', dangerouslyAllowBrowser: true });
      }
      const chatMessages: ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
        { role: 'user', content: input }
      ];
      const completion = await openai.chat.completions.create({
        model: usedModel,
        messages: chatMessages,
        max_tokens: 256,
      });
      const aiMsg = completion.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not respond.';
      setMessages(msgs => {
        const newMsgs: ChatCompletionMessageParam[] = [...msgs, { role: 'assistant', content: aiMsg }];
        if (/correction[:：]/i.test(aiMsg) || /should be/i.test(aiMsg)) {
          newMsgs.push({ role: 'assistant', content: 'It looks like your last message had a mistake. Please review the correction above.' });
        }
        return newMsgs;
      });
    } catch {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Failed to get response.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Generate exercises based on current language pair
  const generateExercises = async (count = 5, difficulty = 'B1') => {
    setExerciseMode(true);
    setExerciseCount(count);
    setExerciseDifficulty(difficulty);
    setExercises([]);
    setCurrentExercise(0);
    setGrades([]);
    setReport('');
    setLoading(true);
    try {
      let openai;
      const usedModel = model;
      if (provider === 'OpenAI') {
        openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      } else {
        openai = new OpenAI({ apiKey: ghKey, baseURL: 'https://models.github.ai/inference', dangerouslyAllowBrowser: true });
      }
      let diffLabel = difficulty;
      const isChinese = (lang: Language) => lang === 'Chinese (Simplified)' || lang === 'Chinese (Traditional)';
      if ((isChinese(sourceLang) || isChinese(targetLang)) && /^HSK/.test(difficulty)) {
        diffLabel = difficulty;
      } else if ((sourceLang === 'English' || sourceLang === 'French' || targetLang === 'English' || targetLang === 'French')) {
        diffLabel = 'CEFR ' + difficulty;
      }
      const exercisePrompt = `Generate a list of ${count} translation or comprehension exercises for a user learning ${targetLang} from ${sourceLang} at ${diffLabel} level. Format as a numbered list. Do not include answers.`;
      const chatMessages: ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
        { role: 'user', content: exercisePrompt }
      ];
      const completion = await openai.chat.completions.create({
        model: usedModel,
        messages: chatMessages,
        max_tokens: 512,
      });
      const aiMsg = completion.choices?.[0]?.message?.content?.trim() || '';
      // Parse exercises from numbered list
      const exList = aiMsg.split(/\n\d+\. /).filter(Boolean);
      setExercises(exList.length >= count ? exList : aiMsg.split(/\n/).filter(Boolean));
    } catch {
      setExercises(['Failed to generate exercises.']);
    } finally {
      setLoading(false);
    }
  };

  // Handle exercise answer submission
  const submitExerciseAnswer = async () => {
    if (!input.trim()) return;
    setGrades(g => [...g, input]);
    setInput('');
    setLoading(true);
    try {
      let openai;
      const usedModel = model;
      if (provider === 'OpenAI') {
        openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      } else {
        openai = new OpenAI({ apiKey: ghKey, baseURL: 'https://models.github.ai/inference', dangerouslyAllowBrowser: true });
      }
      // Get AI's ideal answer
      const answerPrompt = `Provide the ideal answer for this exercise in ${targetLang}: ${exercises[currentExercise]}`;
      const chatMessages: ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: answerPrompt }
      ];
      const completion = await openai.chat.completions.create({
        model: usedModel,
        messages: chatMessages,
        max_tokens: 128,
      });
      const aiAnswer = completion.choices?.[0]?.message?.content?.trim() || '';
      // Grade using Jaccard
      const score = jaccardSimilarity(input, aiAnswer);
      setGrades(g => [...g, score]);
      setMessages(msgs => [...msgs, { role: 'assistant', content: `Your answer: ${input}\nIdeal answer: ${aiAnswer}\nJaccard similarity: ${(score).toFixed(1)}%` }]);
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(idx => idx + 1);
      } else {
        setGrading(true);
        // Generate report
        const avg = grades.concat(score).reduce((a, b) => a + b, 0) / (grades.length + 1);
        let advice = '';
        if (avg > 0.8) advice = 'Excellent! Keep practicing for fluency.';
        else if (avg > 0.6) advice = 'Good job! Focus on vocabulary and minor grammar.';
        else advice = 'Needs improvement. Review key grammar and vocabulary.';
        setReport(`Final Report:\nAverage similarity: ${(avg * 100).toFixed(1)}%\nAdvice: ${advice}`);
      }
    } catch {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Failed to grade answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="techno-card" style={{ maxWidth: 700, margin: '2rem auto', position: 'relative', minHeight: 500, width: '100%' }}>
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
      <div style={{ width: '100%', maxWidth: 600, minWidth: 0, margin: '0 auto' }}>
        <h2 className="techno-title" style={{ marginBottom: 12, wordBreak: 'break-word', fontSize: '2em' }}>PollyGlot Chat</h2>
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <LanguageSelector
            label="Source Language"
            value={sourceLang}
            onChange={(lang: Language) => { dispatch(setSourceLang(lang)); localStorage.setItem('pollyglot_sourceLang', lang); }}
          />
          <LanguageSelector
            label="Target Language"
            value={targetLang}
            onChange={(lang: Language) => { dispatch(setTargetLang(lang)); localStorage.setItem('pollyglot_targetLang', lang); }}
          />
        </div>
        {!exerciseMode && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, gap: 8 }}>
            <input
              type="number"
              min={5}
              value={exerciseCount}
              onChange={e => setExerciseCount(Math.max(5, Number(e.target.value)))}
              style={{ width: 60, fontSize: 14, borderRadius: 4, border: '1px solid #7f5af0', background: '#181825', color: '#fff', padding: '0.2em 0.5em' }}
              disabled={loading}
              aria-label="Exercise count"
            />
            <select
              value={exerciseDifficulty}
              onChange={e => setExerciseDifficulty(e.target.value)}
              style={{ fontSize: 14, borderRadius: 4, border: '1px solid #7f5af0', background: '#181825', color: '#fff', padding: '0.2em 0.5em', minWidth: 90 }}
              disabled={loading}
              aria-label="Difficulty"
            >
              {((targetLang === 'Chinese (Simplified)' || targetLang === 'Chinese (Traditional)' || sourceLang === 'Chinese (Simplified)' || sourceLang === 'Chinese (Traditional)')
                ? ['HSK1','HSK2','HSK3','HSK4','HSK5','HSK6']
                : ['A1','A2','B1','B2','C1','C2'])
                .map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
            <button className="techno-btn" style={{ fontSize: 14, padding: '0.3em 1em' }} onClick={() => generateExercises(exerciseCount, exerciseDifficulty)} disabled={loading}>
              Generate Exercises
            </button>
          </div>
        )}
        {exerciseMode ? (
          <div style={{ marginBottom: 16 }}>
            {grading ? (
              <div style={{ background: '#232347', borderRadius: 8, padding: 16, color: '#fff' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 15 }}>{report}</pre>
                <button className="techno-btn" style={{ marginTop: 12 }} onClick={() => { setExerciseMode(false); setExercises([]); setCurrentExercise(0); setGrades([]); setReport(''); setGrading(false); }}>
                  Back to Chat
                </button>
              </div>
            ) : exercises.length > 0 && currentExercise < exercises.length ? (
              <div>
                <div style={{ marginBottom: 10, color: '#fff', fontWeight: 500 }}>Exercise {currentExercise + 1} of {exercises.length}:</div>
                <div style={{ background: '#232347', borderRadius: 8, padding: 12, marginBottom: 10, color: '#fff' }}>{exercises[currentExercise]}</div>
                <form style={{ display: 'flex', gap: 8 }} onSubmit={e => { e.preventDefault(); submitExerciseAnswer(); }}>
                  <input
                    className="techno-input"
                    style={{ flex: 1 }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your answer..."
                    disabled={loading}
                  />
                  <button className="techno-btn" type="submit" disabled={loading || !input.trim()} style={{ minWidth: 90 }}>
                    {loading ? '...' : 'Submit'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ color: '#fff' }}>Loading exercises...</div>
            )}
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', width: '100%', marginBottom: 16, background: 'rgba(44,46,70,0.7)', borderRadius: 8, padding: 12, minHeight: 200 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  margin: '0.5em 0',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  color: msg.role === 'user' ? 'var(--techno-accent2)' : 'var(--techno-text)',
                  fontWeight: msg.role === 'user' ? 600 : 400
                }}>
                  <span style={{
                    display: 'inline-block',
                    background: msg.role === 'user' ? 'rgba(44,182,125,0.15)' : 'rgba(127,90,240,0.10)',
                    borderRadius: 8,
                    padding: '0.5em 1em',
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                    boxShadow: msg.role === 'user' ? '0 2px 8px #2cb67d22' : '0 2px 8px #7f5af022'
                  }}>{
                    typeof msg.content === 'string'
                      ? msg.content
                      : Array.isArray(msg.content)
                        ? msg.content.map(part => {
                            if (typeof part === 'string') return part;
                            if ('text' in part) return part.text;
                            return '';
                          }).join(' ')
                        : ''
                  }</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form style={{ display: 'flex', gap: 8, width: '100%' }} onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <input
                className="techno-input"
                style={{ flex: 1 }}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
              />
              <button className="techno-btn" type="submit" disabled={loading || !input.trim()} style={{ minWidth: 90 }}>
                {loading ? '...' : 'Send'}
              </button>
            </form>
          </>
        )}
        <div className="techno-muted" style={{ marginTop: 12, fontSize: 13 }}>
          Powered by OpenAI GPT-4o. All logic runs in your browser.
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const SYSTEM_PROMPT = `You are PollyGlot, a friendly, unbiased, and context-aware translation chat assistant. Respond naturally and helpfully. Do not include language names or extra notes. Use the target language if the user requests translation.`;

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    { role: 'assistant', content: 'Hello! How can I help you with translation today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const apiKey = localStorage.getItem('openai_api_key') || '';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);
    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const chatMessages: ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
        { role: 'user', content: input }
      ];
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: chatMessages,
        max_tokens: 256,
      });
      const aiMsg = completion.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not respond.';
      setMessages(msgs => [...msgs, { role: 'assistant', content: aiMsg }]);
    } catch {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Failed to get response.' }]);
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
        <div className="techno-muted" style={{ marginTop: 12, fontSize: 13 }}>
          Powered by OpenAI GPT-4o. All logic runs in your browser.
        </div>
      </div>
    </div>
  );
}

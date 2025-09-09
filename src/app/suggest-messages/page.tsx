'use client';

import { useState } from 'react';

export default function StreamTestPage() {
  const [output, setOutput] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);

  const handleClick = async () => {
    setOutput('');
    setQuestions([]);

    const res = await fetch('/api/suggest-messages', { method: 'POST' });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }
      // After stream ends, split by '||'
      const splitQuestions = fullText.split('||').map(q => q.trim()).filter(Boolean);
      setQuestions(splitQuestions);
      setOutput(fullText);  // Optional: to see raw text
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Gemini Streaming</h2>
      <button onClick={handleClick}>Generate Questions</button>
      <pre style={{ marginTop: 20 }}>{output}</pre>
      <ul>
        {questions.map((q, idx) => (
          <li key={idx}>{q}</li>
        ))}
      </ul>
    </div>
  );
}

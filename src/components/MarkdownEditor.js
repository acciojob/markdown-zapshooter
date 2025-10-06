import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Updates preview in real time
  useEffect(() => {
    setLoading(true);
    // Simulate loading; remove if not required for tests
    const timer = setTimeout(() => {
      setPreview(markdown);
      setLoading(false);
    }, 100); // Emulates preview generation
    return () => clearTimeout(timer);
  }, [markdown]);

  return (
    <div className="editor-container">
      <textarea
        className="textarea"
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
        placeholder="Enter Markdown here..."
        data-testid="markdown-input"
      />
      <div className="preview">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ReactMarkdown>{preview}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}
export default MarkdownEditor;

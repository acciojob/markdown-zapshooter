import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [markdown, setMarkdown] = useState('# Hello world\n\nStart typing your markdown here...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate any async operations if needed
    setLoading(false);
  }, [markdown]);

  const handleInputChange = (e) => {
    setMarkdown(e.target.value);
  };

  // Basic Markdown to HTML converter
  const parseMarkdown = (text) => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />');

    // Code blocks
    html = html.replace(/``````/gim, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

    // Line breaks
    html = html.replace(/\n\n/gim, '</p><p>');
    html = html.replace(/\n/gim, '<br />');

    // Wrap in paragraph
    html = '<p>' + html + '</p>';

    return html;
  };

  return (
    <div className="app">
      {loading && <div className="loading">Loading...</div>}
      
      <div className="editor-container">
        <div className="input-section">
          <h2>Markdown Input</h2>
          <textarea
            className="textarea"
            value={markdown}
            onChange={handleInputChange}
            placeholder="Enter your markdown here..."
          />
        </div>

        <div className="preview-section">
          <h2>Preview</h2>
          <div 
            className="preview"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
// import './styles.css'; // Commented to avoid path/module error; add if styles.css exists in src/components/

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

  // Inline parser for bold, italic, etc.
  const parseInline = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    return text;
  };

  // Block-level parser: process lines for headers, lists, paragraphs
  const parseMarkdown = (text) => {
    const lines = text.split('\n');
    let html = '';
    let inUl = false;
    let inOl = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inUl) {
          html += '</ul>';
          inUl = false;
        }
        if (inOl) {
          html += '</ol>';
          inOl = false;
        }
        html += '<br>';
        return;
      }

      if (trimmed.startsWith('### ')) {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
        html += `<h3>${parseInline(trimmed.slice(4))}</h3>`;
      } else if (trimmed.startsWith('## ')) {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
        html += `<h2>${parseInline(trimmed.slice(3))}</h2>`;
      } else if (trimmed.startsWith('# ')) {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
        html += `<h1>${parseInline(trimmed.slice(2))}</h1>`;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inUl) {
          if (inOl) { html += '</ol>'; inOl = false; }
          html += '<ul>';
          inUl = true;
        }
        html += `<li>${parseInline(trimmed.slice(2))}</li>`;
      } else if (/^\d+\. /.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s*(.*)/);
        if (!inOl) {
          if (inUl) { html += '</ul>'; inUl = false; }
          html += '<ol>';
          inOl = true;
        }
        html += `<li>${parseInline(match[2])}</li>`;
      } else {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (inOl) { html += '</ol>'; inOl = false; }
        html += `<p>${parseInline(trimmed)}</p>`;
      }
    });

    if (inUl) html += '</ul>';
    if (inOl) html += '</ol>';
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

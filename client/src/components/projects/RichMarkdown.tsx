import React from 'react';

interface RichMarkdownProps {
  content: string;
  className?: string;
}

export const RichMarkdown: React.FC<RichMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Simple, robust zero-dependency Markdown renderer
  const renderFormattedText = (text: string): React.ReactNode => {
    // Process inline markdown: bold, italic, code, links
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Regex to match inline code, bold, link
    const inlineRegex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/;

    while (remaining.length > 0) {
      const match = inlineRegex.exec(remaining);
      if (!match) {
        parts.push(remaining);
        break;
      }

      if (match.index > 0) {
        parts.push(remaining.substring(0, match.index));
      }

      const token = match[0];
      if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-dark-elevated text-brand-cyan font-mono text-[12px] border border-black/5 dark:border-white/10"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-slate-950 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={keyIdx++} className="italic text-slate-800 dark:text-zinc-200">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('[') && token.includes('](')) {
        const linkMatch = /\[(.*?)\]\((.*?)\)/.exec(token);
        if (linkMatch) {
          parts.push(
            <a
              key={keyIdx++}
              href={linkMatch[2]}
              target="_blank"
              rel="noreferrer"
              className="text-brand-500 hover:text-brand-400 underline font-medium"
            >
              {linkMatch[1]}
            </a>
          );
        } else {
          parts.push(token);
        }
      } else {
        parts.push(token);
      }

      remaining = remaining.substring(match.index + token.length);
    }

    return parts;
  };

  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let currentList: string[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-3 space-y-1.5 list-disc list-inside text-slate-700 dark:text-zinc-300">
          {currentList.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderFormattedText(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code block ```
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        blocks.push(
          <pre
            key={`code-${blocks.length}`}
            className="my-4 p-4 rounded-xl bg-dark-bg text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800"
          >
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // List item
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      currentList.push(line.trim().substring(2));
      continue;
    }

    flushList();

    // Empty line
    if (!line.trim()) {
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push(
        <h4 key={`h3-${blocks.length}`} className="text-base sm:text-lg font-display font-bold text-slate-950 dark:text-white mt-6 mb-2">
          {renderFormattedText(line.replace('### ', ''))}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      blocks.push(
        <h3 key={`h2-${blocks.length}`} className="text-lg sm:text-xl font-display font-bold text-slate-950 dark:text-white mt-7 mb-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-1.5">
          {renderFormattedText(line.replace('## ', ''))}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      blocks.push(
        <h2 key={`h1-${blocks.length}`} className="text-xl sm:text-2xl font-display font-bold text-slate-950 dark:text-white mt-8 mb-3">
          {renderFormattedText(line.replace('# ', ''))}
        </h2>
      );
    } else if (line.startsWith('> ')) {
      // Blockquote
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="my-3 pl-4 border-l-2 border-brand-500 italic text-slate-600 dark:text-zinc-400 bg-brand-500/[0.03] py-2 pr-3 rounded-r-xl"
        >
          {renderFormattedText(line.replace(/^>\s*/, ''))}
        </blockquote>
      );
    } else if (line.trim() === '---') {
      blocks.push(<hr key={`hr-${blocks.length}`} className="my-6 border-black/[0.08] dark:border-white/[0.08]" />);
    } else {
      // Standard paragraph
      blocks.push(
        <p key={`p-${blocks.length}`} className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base my-2">
          {renderFormattedText(line)}
        </p>
      );
    }
  }

  flushList();

  return <div className={`rich-markdown space-y-1 ${className}`}>{blocks}</div>;
};

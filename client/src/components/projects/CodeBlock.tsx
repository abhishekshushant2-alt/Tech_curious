import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';
import { SourceCodeItem } from '../../lib/types.js';

interface CodeBlockProps {
  sourceCode: SourceCodeItem[];
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ sourceCode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!sourceCode || sourceCode.length === 0) return null;

  const currentFile = sourceCode[activeTab] || sourceCode[0];

  const handleCopy = () => {
    if (!currentFile?.code) return;
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-dark-bg border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header bar with tabs and copy action */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-surface/90 border-b border-slate-800">
        {/* File Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          <Terminal className="w-4 h-4 text-brand-cyan mr-1 shrink-0" />
          {sourceCode.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                activeTab === idx
                  ? 'bg-dark-elevated text-brand-cyan border border-brand-cyan/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-elevated/40'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.filename}</span>
            </button>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-mono bg-dark-elevated hover:bg-slate-800 text-slate-300 transition-all ml-2 shrink-0 border border-slate-700/50"
          title="Copy source code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand-mint" />
              <span className="text-brand-mint font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Viewer */}
      <div className="p-4 sm:p-6 overflow-x-auto max-h-[500px] text-xs sm:text-sm font-mono leading-relaxed bg-dark-bg/95">
        <pre className="text-slate-200">
          <code>{currentFile.code}</code>
        </pre>
      </div>

      {/* Footer language indicator */}
      <div className="px-4 py-2 bg-dark-surface/40 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Language: {currentFile.language || 'Plain Text'}</span>
        <span>{currentFile.code.split('\n').length} lines</span>
      </div>
    </div>
  );
};

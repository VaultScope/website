import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock = ({ code, language = 'bash', title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-lg border border-border bg-foreground/[0.02] overflow-hidden not-prose">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--line)] bg-[var(--bg-elevated)] text-xs font-mono text-[var(--text-muted)]">
        <span className="uppercase tracking-wider">
          {title || language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-[13px] font-mono leading-relaxed text-foreground/90 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

import { useState } from 'react';

function inlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*\n]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-slate-900 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function MarkdownRenderer({ text }) {
  if (!text) return null;

  const blocks = text.split(/\n\n+/);
  const elements = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    if (block.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-slate-900 font-semibold text-sm mt-5 mb-1.5 first:mt-0">
          {inlineMarkdown(block.slice(4))}
        </h3>
      );
      continue;
    }
    if (block.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-slate-900 font-semibold text-sm mt-5 mb-1.5 first:mt-0">
          {inlineMarkdown(block.slice(3))}
        </h2>
      );
      continue;
    }
    if (block.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-slate-900 font-bold text-base mt-5 mb-2 first:mt-0">
          {inlineMarkdown(block.slice(2))}
        </h1>
      );
      continue;
    }

    const lines = block.split('\n');
    const allList = lines.every(l => /^[\-\*]\s/.test(l.trim()) || /^\d+\.\s/.test(l.trim()) || l.trim() === '');
    const listLines = lines.filter(l => /^[\-\*]\s/.test(l.trim()) || /^\d+\.\s/.test(l.trim()));

    if (allList && listLines.length > 0) {
      elements.push(
        <ul key={i} className="space-y-2 my-1">
          {listLines.map((item, j) => {
            const content = item.replace(/^[\-\*]\s+/, '').replace(/^\d+\.\s+/, '');
            return (
              <li key={j} className="flex items-start gap-3 text-slate-700 text-sm">
                <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="leading-relaxed">{inlineMarkdown(content)}</span>
              </li>
            );
          })}
        </ul>
      );
      continue;
    }

    elements.push(
      <p key={i} className="text-slate-700 text-sm leading-[1.75]">
        {inlineMarkdown(block)}
      </p>
    );
  }

  return <div className="space-y-2.5">{elements}</div>;
}

function LoadingPulse() {
  return (
    <div className="py-5 space-y-2.5">
      {[100, 90, 95, 80].map((w, i) => (
        <div
          key={i}
          className="h-3 bg-slate-100 rounded-full animate-pulse"
          style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

function hostname(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}

function SourcesFooter({ sources }) {
  if (!sources?.length) return null;
  return (
    <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/60">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Sources</p>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            title={s.title}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 bg-white text-xs text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors max-w-[240px]"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname(s.url)}&sz=16`}
              className="w-3.5 h-3.5 flex-shrink-0"
              alt=""
            />
            <span className="truncate">{s.title || hostname(s.url)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SectionCard({ id, icon, title, status, text, sources, error }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isDone = status === 'done';
  const isStreaming = status === 'streaming';
  const isError = status === 'error';
  const isPending = status === 'pending';

  return (
    <div
      id={id}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-20"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <span className="text-lg leading-none">{icon}</span>
          <span className="font-semibold text-slate-900 text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {isDone && (
            <>
              <button
                onClick={handleCopy}
                className="text-xs px-2.5 py-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition font-medium"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                ✓
              </span>
            </>
          )}
          {isStreaming && (
            <span className="flex items-center gap-1 text-xs text-indigo-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Writing
            </span>
          )}
          {isError && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-xs">
              ✕
            </span>
          )}
          {isPending && !text && (
            <span className="text-xs text-slate-400">Queued</span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 min-h-[72px]">
        {isPending && !text && <LoadingPulse />}
        {isStreaming && !text && <LoadingPulse />}

        {isError && (
          <p className="text-red-600 text-sm py-1">
            {error || 'Something went wrong. Check your API key and try again.'}
          </p>
        )}

        {text && (
          <div>
            <MarkdownRenderer text={text} />
            {isStreaming && (
              <span className="inline-block w-0.5 h-3.5 bg-indigo-500 ml-0.5 align-middle animate-blink" />
            )}
          </div>
        )}
      </div>

      {isDone && <SourcesFooter sources={sources} />}
    </div>
  );
}

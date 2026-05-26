import { useState } from 'react';

const MODES = [
  {
    id: 'quick',
    label: 'Quick',
    model: 'Haiku',
    description: 'Faster, ~8× cheaper. Good for initial screening.',
    costHint: '~$0.05 / run',
    color: 'emerald',
  },
  {
    id: 'detailed',
    label: 'Detailed',
    model: 'Sonnet',
    description: 'Deeper research, better synthesis. Use before interviews.',
    costHint: '~$0.35 / run',
    color: 'indigo',
  },
];

export default function InputScreen({ onStart, onHistory }) {
  const [company, setCompany] = useState('');
  const [jd, setJd] = useState('');
  const [mode, setMode] = useState('detailed');

  const canStart = company.trim() && jd.trim();

  function handleSubmit(e) {
    e.preventDefault();
    if (!canStart) return;
    onStart({ company: company.trim(), jd: jd.trim(), mode });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4 text-xl shadow-md">
            🎯
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Hunt Agent</h1>
          <p className="mt-1.5 text-slate-500 text-sm">
            Paste a company and JD — get a full research brief in 2–3 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Mode picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Research depth
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                    mode === m.id
                      ? m.id === 'quick'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-semibold ${
                      mode === m.id
                        ? m.id === 'quick' ? 'text-emerald-700' : 'text-indigo-700'
                        : 'text-slate-700'
                    }`}>
                      {m.label}
                    </span>
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                      mode === m.id
                        ? m.id === 'quick' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {m.costHint}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">{m.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Linear, Notion, Rippling"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-white"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Job Description
            </label>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={9}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none transition leading-relaxed bg-white scrollbar-thin"
            />
            {jd && (
              <p className="mt-1 text-xs text-slate-400 text-right">{jd.length.toLocaleString()} chars</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canStart}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all
              bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Start Research →
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-4">
          <p className="text-xs text-slate-400">
            10 parallel searches · Company research + interview prep
          </p>
          <button
            type="button"
            onClick={onHistory}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition flex-shrink-0"
          >
            View history →
          </button>
        </div>
      </div>
    </div>
  );
}

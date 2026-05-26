import { useState } from 'react';
import { loadRuns, deleteRun } from '../storage';
import { ALL_SECTIONS } from '../prompts';

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

function completionCount(run) {
  return Object.values(run.sections || {}).filter(s => s.status === 'done').length;
}

export default function HistoryScreen({ onNewSearch, onViewRun }) {
  const [runs, setRuns] = useState(() => loadRuns());

  function handleDelete(e, id) {
    e.stopPropagation();
    deleteRun(id);
    setRuns(loadRuns());
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🗂️</span>
            <span className="font-bold text-slate-900">Research History</span>
          </div>
          <button
            onClick={onNewSearch}
            className="text-sm px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            + New Search
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8">
        {runs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-4">📭</div>
            <p className="font-medium text-slate-500">No saved research yet.</p>
            <p className="text-sm mt-1">Start a search — results save automatically.</p>
            <button
              onClick={onNewSearch}
              className="mt-5 text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Start your first search
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {runs.map(run => {
              const done = completionCount(run);
              const total = ALL_SECTIONS.length;
              const isComplete = done === total;

              return (
                <button
                  key={run.id}
                  onClick={() => onViewRun(run)}
                  className="w-full text-left bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-1">
                        <span className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                          {run.company}
                        </span>
                        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                          isComplete
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {isComplete ? `${done}/${total} complete` : `${done}/${total} sections`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {run.jd?.slice(0, 120)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400">{timeAgo(run.createdAt)}</span>
                      <button
                        onClick={e => handleDelete(e, run.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Section completion bar */}
                  <div className="mt-3 flex items-center gap-1.5">
                    {ALL_SECTIONS.map(sec => {
                      const s = run.sections?.[sec.id];
                      return (
                        <div
                          key={sec.id}
                          title={sec.title}
                          className={`h-1 flex-1 rounded-full ${
                            s?.status === 'done'
                              ? 'bg-emerald-400'
                              : s?.status === 'error'
                              ? 'bg-red-300'
                              : 'bg-slate-100'
                          }`}
                        />
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { RESEARCH_SECTIONS, INTERVIEW_SECTIONS, ALL_SECTIONS } from '../prompts';
import { streamSection } from '../api';
import { saveRun } from '../storage';
import SectionCard from './SectionCard';

const STAGGER_MS = 800;
const TOTAL = ALL_SECTIONS.length;

function buildInitialSections(savedRun) {
  const s = {};
  ALL_SECTIONS.forEach(sec => {
    const saved = savedRun?.sections?.[sec.id];
    s[sec.id] = saved ?? { status: 'pending', text: '', sources: [], error: null };
  });
  return s;
}

function StatusDot({ status }) {
  if (status === 'done') return <span className="text-emerald-500 text-xs">✓</span>;
  if (status === 'streaming') return <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />;
  if (status === 'error') return <span className="text-red-400 text-xs">✕</span>;
  return <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />;
}

function SidebarItem({ section, status }) {
  function scrollTo() {
    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  return (
    <button
      onClick={scrollTo}
      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-100 transition-colors group"
    >
      <span className="text-base leading-none flex-shrink-0">{section.icon}</span>
      <span className="text-sm text-slate-600 group-hover:text-slate-900 flex-1 truncate transition-colors">
        {section.title}
      </span>
      <StatusDot status={status} />
    </button>
  );
}

function CategoryLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2.5 mb-1 mt-5 first:mt-0">
      {children}
    </p>
  );
}

function SectionGroupLabel({ label, count, done }) {
  const allDone = done === count;
  return (
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</h2>
      <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
        allDone ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
      }`}>
        {done}/{count}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

export default function ResultsScreen({ config, savedRun, onReset, onHistory }) {
  const isReadOnly = !!savedRun;
  const company = savedRun?.company ?? config?.company ?? '';
  const jd = savedRun?.jd ?? config?.jd ?? '';
  const mode = savedRun?.mode ?? config?.mode ?? 'detailed';

  const [sections, setSections] = useState(() => buildInitialSections(savedRun));
  const timersRef = useRef([]);

  // Stable run ID and timestamp for saving
  const runIdRef = useRef(savedRun?.id ?? crypto.randomUUID());
  const createdAtRef = useRef(savedRun?.createdAt ?? new Date().toISOString());

  const doneCount = Object.values(sections).filter(
    s => s.status === 'done' || s.status === 'error'
  ).length;
  const progress = Math.round((doneCount / TOTAL) * 100);

  // Persist to localStorage whenever a section status changes (not on every text chunk)
  const statusKey = Object.values(sections).map(s => s.status).join(',');
  useEffect(() => {
    if (isReadOnly) return;
    const hasSomething = Object.values(sections).some(
      s => s.status === 'done' || s.status === 'error'
    );
    if (!hasSomething) return;

    const allFinished = doneCount === TOTAL;
    saveRun({
      id: runIdRef.current,
      company,
      jd,
      mode,
      createdAt: createdAtRef.current,
      completedAt: allFinished ? new Date().toISOString() : null,
      sections: Object.fromEntries(
        Object.entries(sections).map(([id, s]) => [
          id,
          s.status === 'done' || s.status === 'error'
            ? { text: s.text, sources: s.sources ?? [], status: s.status, error: s.error }
            : { text: '', sources: [], status: 'pending', error: null },
        ])
      ),
    });
  }, [statusKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fire API calls (live mode only)
  useEffect(() => {
    if (isReadOnly) return;

    ALL_SECTIONS.forEach((sec, index) => {
      const timer = setTimeout(() => {
        const prompt = sec.buildPrompt(company, jd);

        setSections(prev => ({
          ...prev,
          [sec.id]: { ...prev[sec.id], status: 'streaming' },
        }));

        streamSection({
          prompt,
          mode,
          useWebSearch: sec.needsSearch,
          onChunk: chunk => {
            setSections(prev => ({
              ...prev,
              [sec.id]: {
                ...prev[sec.id],
                status: 'streaming',
                text: prev[sec.id].text + chunk,
              },
            }));
          },
          onComplete: (_, sources) => {
            setSections(prev => ({
              ...prev,
              [sec.id]: { ...prev[sec.id], status: 'done', sources: sources ?? [] },
            }));
          },
          onError: msg => {
            setSections(prev => ({
              ...prev,
              [sec.id]: { ...prev[sec.id], status: 'error', error: msg },
            }));
          },
        });
      }, index * STAGGER_MS);

      timersRef.current.push(timer);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const headerHeight = 57;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg">🎯</span>
            <span className="font-bold text-slate-900 truncate">{company}</span>
            {isReadOnly && (
              <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium flex-shrink-0">
                Saved
              </span>
            )}
            {!isReadOnly && (
              <span className="hidden sm:inline text-slate-400 text-sm">— Research Brief</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isReadOnly && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs tabular-nums">{doneCount}/{TOTAL}</span>
              </div>
            )}
            <button
              onClick={onHistory}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition font-medium"
            >
              History
            </button>
            <button
              onClick={onReset}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              + New
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:block w-52 flex-shrink-0 py-6 pr-2"
          style={{
            position: 'sticky',
            top: headerHeight,
            height: `calc(100vh - ${headerHeight}px)`,
            overflowY: 'auto',
          }}
        >
          <CategoryLabel>Company Research</CategoryLabel>
          {RESEARCH_SECTIONS.map(sec => (
            <SidebarItem key={sec.id} section={sec} status={sections[sec.id]?.status} />
          ))}
          <CategoryLabel>Interview Prep</CategoryLabel>
          {INTERVIEW_SECTIONS.map(sec => (
            <SidebarItem key={sec.id} section={sec} status={sections[sec.id]?.status} />
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-6 px-4 lg:px-8 space-y-4 pb-16">
          {/* Mobile progress */}
          {!isReadOnly && (
            <div className="lg:hidden flex items-center gap-3 mb-2">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 tabular-nums">{doneCount}/{TOTAL}</span>
            </div>
          )}

          <SectionGroupLabel
            label="Company Research"
            count={RESEARCH_SECTIONS.length}
            done={RESEARCH_SECTIONS.filter(s => sections[s.id]?.status === 'done').length}
          />
          {RESEARCH_SECTIONS.map(sec => (
            <SectionCard
              key={sec.id}
              id={sec.id}
              icon={sec.icon}
              title={sec.title}
              status={sections[sec.id]?.status ?? 'pending'}
              text={sections[sec.id]?.text ?? ''}
              sources={sections[sec.id]?.sources ?? []}
              error={sections[sec.id]?.error}
            />
          ))}

          <div className="pt-4">
            <SectionGroupLabel
              label="Interview Prep"
              count={INTERVIEW_SECTIONS.length}
              done={INTERVIEW_SECTIONS.filter(s => sections[s.id]?.status === 'done').length}
            />
          </div>
          {INTERVIEW_SECTIONS.map(sec => (
            <SectionCard
              key={sec.id}
              id={sec.id}
              icon={sec.icon}
              title={sec.title}
              status={sections[sec.id]?.status ?? 'pending'}
              text={sections[sec.id]?.text ?? ''}
              sources={sections[sec.id]?.sources ?? []}
              error={sections[sec.id]?.error}
            />
          ))}
        </main>
      </div>
    </div>
  );
}

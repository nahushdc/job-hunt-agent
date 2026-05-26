const KEY = 'jha:runs';

export function loadRuns() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveRun(run) {
  const runs = loadRuns();
  const idx = runs.findIndex(r => r.id === run.id);
  if (idx >= 0) {
    runs[idx] = run;
  } else {
    runs.unshift(run);
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(runs));
  } catch (e) {
    // Storage full — drop oldest run and retry once
    if (e.name === 'QuotaExceededError' && runs.length > 1) {
      runs.pop();
      try { localStorage.setItem(KEY, JSON.stringify(runs)); } catch {}
    }
  }
}

export function deleteRun(id) {
  const runs = loadRuns().filter(r => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(runs));
}

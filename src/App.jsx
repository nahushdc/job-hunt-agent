import { useState } from 'react';
import InputScreen from './components/InputScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';

export default function App() {
  const [screen, setScreen] = useState('input');
  const [config, setConfig] = useState(null);
  const [savedRun, setSavedRun] = useState(null);

  function handleStart({ company, jd }) {
    setConfig({ company, jd });
    setSavedRun(null);
    setScreen('results');
  }

  function handleViewRun(run) {
    setSavedRun(run);
    setConfig(null);
    setScreen('results');
  }

  function handleReset() {
    setConfig(null);
    setSavedRun(null);
    setScreen('input');
  }

  function handleShowHistory() {
    setScreen('history');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {screen === 'input' && (
        <InputScreen onStart={handleStart} onHistory={handleShowHistory} />
      )}
      {screen === 'history' && (
        <HistoryScreen onNewSearch={handleReset} onViewRun={handleViewRun} />
      )}
      {screen === 'results' && (
        <ResultsScreen
          config={config}
          savedRun={savedRun}
          onReset={handleReset}
          onHistory={handleShowHistory}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import SmartTaskCounter from './exams/exam1-counter/SmartTaskCounter.jsx';
import LiveSearchTimer from './exams/exam2-search-timer/LiveSearchTimer.jsx';
import AccessibleForm from './exams/exam3-form-toolkit/AccessibleForm.jsx';
import PreferencesApp from './exams/exam4-preferences/PreferencesApp.jsx';
import ProductExplorer from './exams/exam5-performance/ProductExplorer.jsx';
import IssueTracker from './exams/exam6-issue-tracker/IssueTracker.jsx';

const EXAM_TABS = [
  {
    id: 'exam1',
    shortLabel: 'Exam 1',
    title: 'Smart Task Counter',
    hooks: 'useState'
  },
  {
    id: 'exam2',
    shortLabel: 'Exam 2',
    title: 'Live Search & Timer',
    hooks: 'useEffect + useState'
  },
  {
    id: 'exam3',
    shortLabel: 'Exam 3',
    title: 'Accessible Form Toolkit',
    hooks: 'useRef + useState'
  },
  {
    id: 'exam4',
    shortLabel: 'Exam 4',
    title: 'Application Preferences',
    hooks: 'useContext + useState'
  },
  {
    id: 'exam5',
    shortLabel: 'Exam 5',
    title: 'Product Explorer',
    hooks: 'useMemo + useCallback'
  },
  {
    id: 'exam6',
    shortLabel: 'Exam 6',
    title: 'Issue Tracker Engine',
    hooks: 'useReducer + Custom Hook'
  }
];

function App() {
  const [activeExam, setActiveExam] = useState('exam1');

  return (
    <div className="app-shell">
      <header className="top-navbar">
        <div className="navbar-inner">
          <div className="brand-block">
            <span className="brand-badge">React Hooks Practical Series</span>
            <strong className="brand-title">Exams 1–6 Suite (120 pts)</strong>
          </div>

          <nav className="exam-nav" aria-label="Practical Exam Switcher">
            {EXAM_TABS.map((exam) => {
              const isActive = activeExam === exam.id;
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => setActiveExam(exam.id)}
                  className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  data-testid={`nav-${exam.id}`}
                >
                  <span className="nav-tab-num">{exam.shortLabel}</span>
                  <span className="nav-tab-title">{exam.title}</span>
                  <span className="nav-tab-hooks">{exam.hooks}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="main-workspace">
        {activeExam === 'exam1' && <SmartTaskCounter />}
        {activeExam === 'exam2' && <LiveSearchTimer />}
        {activeExam === 'exam3' && <AccessibleForm />}
        {activeExam === 'exam4' && <PreferencesApp />}
        {activeExam === 'exam5' && <ProductExplorer />}
        {activeExam === 'exam6' && <IssueTracker />}
      </main>

      <footer className="app-footer">
        <p>
          React Practical Exam Series (1–6) • Built with Vite + React Hooks Only (No External State
          or Routing Libraries) • Cases 1–17 Included
        </p>
      </footer>
    </div>
  );
}

export default App;

import { useState } from 'react';
import {
  INITIAL_ISSUE_STATE,
  issueReducer,
  runIssueReducerTests
} from './issueReducer.js';
import { usePersistentReducer } from './usePersistentReducer.js';

const STORAGE_KEY = 'exam6_issue_tracker_state_v1';

const DEBUGGING_CASES = [
  {
    id: 'case-15',
    title: 'Case 15: Replacing Direct State/Array Mutation with Pure Immutable Copies',
    brokenCode: `case 'ADD_ISSUE':
  state.issues.push({ id: state.nextId, title: action.payload.title, done: false });
  state.nextId += 1;
  return state;`,
    fixedCode: `case 'ADD_ISSUE': {
  const newIssue = {
    id: state.nextId,
    title: action.payload.title.trim(),
    done: false
  };
  return {
    ...state,
    issues: [...state.issues, newIssue],
    nextId: state.nextId + 1
  };
}`,
    explanation:
      'React compares the previous state reference and next state reference using Object.is(). Mutating state.issues with .push() and returning the existing state reference makes Object.is(prevState, nextState) evaluate to true, so React bails out of rendering. Returning a new top-level object {...state}, a new array [...state.issues, newIssue], and new issue objects in .map() ensures purity and predictable updates.'
  },
  {
    id: 'case-16',
    title: 'Case 16: Mismatched Action Shape (action.payload.title vs. action.title)',
    brokenCode: `dispatch({ type: 'ADD_ISSUE', title: inputTitle });

case 'ADD_ISSUE':
  return { ...state, issues: [...state.issues, { title: action.payload.title }] };`,
    fixedCode: `dispatch({
  type: 'ADD_ISSUE',
  payload: { title: newIssueTitle }
});

const rawTitle = action.payload?.title ?? '';`,
    explanation:
      'Every dispatch call and reducer case must agree on a strict action contract. All parameterized actions in Exam 6 follow the required { type, payload: { ... } } structure, and the reducer uses optional chaining (action.payload?.title) for defensive safety.'
  },
  {
    id: 'case-17',
    title: 'Case 17: Default Branch Returning undefined Instead of Existing state',
    brokenCode: `switch (action.type) {
  case 'ADD_ISSUE':
    return { ...state, ... };
  default:
    return undefined;
}`,
    fixedCode: `switch (action.type) {
  default:
    return state;
}`,
    explanation:
      'If an unrecognized action type is dispatched and the default branch returns undefined (or omits a return statement), the entire reducer state becomes undefined on the next render, crashing any component reading state.issues. Returning state in the default branch safely preserves current state.'
  }
];

const IssueTracker = () => {
  const [state, dispatch] = usePersistentReducer(
    issueReducer,
    INITIAL_ISSUE_STATE,
    STORAGE_KEY
  );
  const [newTitle, setNewTitle] = useState('');
  const [formError, setFormError] = useState('');
  const [testResults, setTestResults] = useState(() => runIssueReducerTests());
  const [lastActionNotice, setLastActionNotice] = useState(
    'State initialized via usePersistentReducer (localStorage).'
  );
  const [showDebug, setShowDebug] = useState(true);

  const totalCount = state.issues.length;
  const openCount = state.issues.filter((issue) => !issue.done).length;
  const doneCount = state.issues.filter((issue) => issue.done).length;

  const visibleIssues = state.issues.filter((issue) => {
    if (state.filter === 'open') {
      return !issue.done;
    }
    if (state.filter === 'done') {
      return issue.done;
    }
    return true;
  });

  const handleAddIssue = (event) => {
    event.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setFormError('Please enter a non-empty issue title before adding.');
      return;
    }

    setFormError('');
    dispatch({
      type: 'ADD_ISSUE',
      payload: { title: trimmed }
    });
    setNewTitle('');
    setLastActionNotice(`Dispatched ADD_ISSUE with payload: { title: "${trimmed}" }`);
  };

  const handleToggleIssue = (id) => {
    dispatch({
      type: 'TOGGLE_ISSUE',
      payload: { id }
    });
    setLastActionNotice(`Dispatched TOGGLE_ISSUE with payload: { id: ${id} }`);
  };

  const handleDeleteIssue = (id) => {
    dispatch({
      type: 'DELETE_ISSUE',
      payload: { id }
    });
    setLastActionNotice(`Dispatched DELETE_ISSUE with payload: { id: ${id} }`);
  };

  const handleSetFilter = (filterValue) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { filter: filterValue }
    });
    setLastActionNotice(`Dispatched SET_FILTER with payload: { filter: "${filterValue}" }`);
  };

  const handleClearDone = () => {
    dispatch({ type: 'CLEAR_DONE' });
    setLastActionNotice('Dispatched CLEAR_DONE to remove all completed issues.');
  };

  const handleDispatchUnknownAction = () => {
    dispatch({ type: 'UNKNOWN_ACTION_PROBE' });
    setLastActionNotice(
      'Dispatched { type: "UNKNOWN_ACTION_PROBE" } -> Default branch safely returned existing state!'
    );
  };

  const handleSeedSampleIssues = () => {
    const sampleTitles = [
      'Audit useEffect cleanup functions in LiveSearchTimer',
      'Verify keyboard focus order in AccessibleForm',
      'Benchmark useMemo filter on 520 product rows'
    ];
    sampleTitles.forEach((title) => {
      dispatch({
        type: 'ADD_ISSUE',
        payload: { title }
      });
    });
    setLastActionNotice('Seeded 3 sample issues via ADD_ISSUE actions.');
  };

  const handleRunTests = () => {
    const freshResults = runIssueReducerTests();
    setTestResults(freshResults);
    setLastActionNotice('Executed all 3 automated reducer unit tests (also logged to console).');
  };

  return (
    <section className="exam-container" aria-labelledby="exam6-heading">
      <header className="exam-header">
        <div>
          <span className="exam-tag">Practical Exam 6 • 20 pts</span>
          <h1 id="exam6-heading">Issue Tracker State Engine</h1>
          <p className="exam-subtitle">
            Primary Hooks: <code>useReducer</code> &amp; Custom Hook{' '}
            <code>usePersistentReducer</code> — Pure immutable state transitions persisted to{' '}
            <code>localStorage</code>.
          </p>
        </div>
        <div className="header-badges">
          <span className="badge badge-primary" data-testid="next-id-badge">
            nextId: {state.nextId}
          </span>
          <span className="badge badge-neutral">All: {totalCount}</span>
          <span className="badge badge-warning">Open: {openCount}</span>
          <span className="badge badge-success">Done: {doneCount}</span>
        </div>
      </header>

      <div className="exam-grid">
        <div className="card">
          <h2>Create &amp; Filter Issues</h2>

          <form onSubmit={handleAddIssue} className="issue-form" noValidate>
            <div className="form-group">
              <label htmlFor="new-issue-title-input">New Issue Title:</label>
              <div className="input-with-action">
                <input
                  id="new-issue-title-input"
                  type="text"
                  value={newTitle}
                  onChange={(event) => {
                    setNewTitle(event.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Describe a bug or task..."
                  className={`text-input ${formError ? 'input-error' : ''}`}
                />
                <button type="submit" className="btn btn-primary">
                  Add Issue
                </button>
              </div>
              {formError && (
                <p className="field-error" role="alert">
                  {formError}
                </p>
              )}
            </div>
          </form>

          <div className="filter-bar">
            <div className="button-group" role="group" aria-label="Filter issues by status">
              <button
                type="button"
                className={`btn btn-small ${state.filter === 'all' ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => handleSetFilter('all')}
                data-testid="filter-all-btn"
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                className={`btn btn-small ${state.filter === 'open' ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => handleSetFilter('open')}
                data-testid="filter-open-btn"
              >
                Open ({openCount})
              </button>
              <button
                type="button"
                className={`btn btn-small ${state.filter === 'done' ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => handleSetFilter('done')}
                data-testid="filter-done-btn"
              >
                Done ({doneCount})
              </button>
            </div>

            <div className="button-group">
              <button
                type="button"
                className="btn btn-danger btn-small"
                onClick={handleClearDone}
                disabled={doneCount === 0}
                data-testid="clear-done-btn"
              >
                Clear Done ({doneCount})
              </button>
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={handleSeedSampleIssues}
              >
                + Seed 3 Sample Issues
              </button>
            </div>
          </div>

          <ul className="issue-list" data-testid="issue-list">
            {visibleIssues.map((issue) => (
              <li
                key={issue.id}
                className={`issue-item ${issue.done ? 'issue-done' : 'issue-open'}`}
              >
                <div className="issue-main">
                  <input
                    id={`issue-checkbox-${issue.id}`}
                    type="checkbox"
                    checked={issue.done}
                    onChange={() => handleToggleIssue(issue.id)}
                  />
                  <label
                    htmlFor={`issue-checkbox-${issue.id}`}
                    className="issue-title-label"
                  >
                    <span className="issue-id-tag">#{issue.id}</span>
                    <span className={issue.done ? 'line-through' : ''}>{issue.title}</span>
                  </label>
                </div>

                <div className="issue-actions">
                  <span className={`badge ${issue.done ? 'badge-success' : 'badge-warning'}`}>
                    {issue.done ? 'Done' : 'Open'}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => handleToggleIssue(issue.id)}
                  >
                    {issue.done ? 'Reopen' : 'Mark Done'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => handleDeleteIssue(issue.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {visibleIssues.length === 0 && (
            <div className="empty-state">
              <p>
                No issues in the <strong>{state.filter.toUpperCase()}</strong> view. Add an issue
                above or click &quot;+ Seed 3 Sample Issues&quot;.
              </p>
            </div>
          )}

          <div className="status-strip">
            <span>
              Last Reducer Transition: <code>{lastActionNotice}</code>
            </span>
          </div>
        </div>

        <div className="card">
          <h2>Automated Reducer Unit Tests &amp; Persistence</h2>
          <p className="helper-text">
            Requirement 6: Three pure unit tests verifying <code>ADD_ISSUE</code>,{' '}
            <code>TOGGLE_ISSUE</code>, and <code>CLEAR_DONE</code> without mutating input state.
          </p>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-primary btn-small"
              onClick={handleRunTests}
              data-testid="run-reducer-tests-btn"
            >
              Re-Run 3 Reducer Unit Tests
            </button>
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={handleDispatchUnknownAction}
            >
              Test Unknown Action (Default Branch)
            </button>
          </div>

          <div className="test-results-list" data-testid="reducer-test-results">
            {testResults.map((test) => (
              <div key={test.id} className="test-result-card">
                <div className="test-result-header">
                  <strong>{test.name}</strong>
                  <span className={`badge ${test.passed ? 'badge-success' : 'badge-danger'}`}>
                    {test.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="helper-text">{test.details}</p>
              </div>
            ))}
          </div>

          <div className="telemetry-item">
            <span className="telemetry-label">
              Live localStorage Snapshot (<code>{STORAGE_KEY}</code>)
            </span>
            <pre className="json-preview">
              <code>{JSON.stringify(state, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="debug-panel card">
        <div className="debug-panel-header">
          <h2>Debugging &amp; Technical Explanation (Cases 15–17)</h2>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => setShowDebug((prev) => !prev)}
          >
            {showDebug ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showDebug && (
          <div className="debug-cases-grid">
            {DEBUGGING_CASES.map((item) => (
              <article key={item.id} className="debug-case-card">
                <h3>{item.title}</h3>
                <div className="code-comparison">
                  <div className="code-block broken">
                    <span className="code-label">Faulty Starter Code</span>
                    <pre>
                      <code>{item.brokenCode}</code>
                    </pre>
                  </div>
                  <div className="code-block fixed">
                    <span className="code-label">Repaired Code</span>
                    <pre>
                      <code>{item.fixedCode}</code>
                    </pre>
                  </div>
                </div>
                <p className="debug-explanation">{item.explanation}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default IssueTracker;


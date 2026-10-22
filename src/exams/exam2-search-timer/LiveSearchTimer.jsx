import { useState, useEffect } from 'react';

const USERS = [
  { id: 1, name: 'Ana Cruz', role: 'Developer' },
  { id: 2, name: 'Ben Lim', role: 'Designer' },
  { id: 3, name: 'Cara Yu', role: 'Tester' },
  { id: 4, name: 'Dan Go', role: 'Developer' }
];

const DEBUGGING_CASES = [
  {
    id: 'case-6',
    title: 'Case 6: Infinite Render Loop in useEffect',
    brokenCode: `useEffect(() => {
  setFilteredUsers(USERS.filter((u) => u.name.includes(query)));
}, [query, filteredUsers]);`,
    fixedCode: `useEffect(() => {
  const timerId = setTimeout(() => {
    const normalized = query.trim().toLowerCase();
    const matches = USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(normalized) ||
        user.role.toLowerCase().includes(normalized)
    );
    setFilteredUsers(matches);
  }, 300);

  return () => clearTimeout(timerId);
}, [query]);`,
    explanation:
      'Because Array.prototype.filter() returns a brand-new array reference every time, including filteredUsers in the dependency array of an effect that calls setFilteredUsers triggers a state update -> re-render -> effect re-run in an infinite loop. The effect should depend only on its true input (query).'
  },
  {
    id: 'case-7',
    title: 'Case 7: Stale Closure in setInterval Timer (Stuck at 1)',
    brokenCode: `useEffect(() => {
  const intervalId = setInterval(() => {
    setSeconds(seconds + 1);
  }, 1000);
  return () => clearInterval(intervalId);
}, []);`,
    fixedCode: `useEffect(() => {
  const intervalId = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => {
    clearInterval(intervalId);
  };
}, []);`,
    explanation:
      'When an effect has an empty dependency array [], its callback runs once on mount and closes over the initial render value of seconds (0). Every tick computes 0 + 1 = 1. Using a functional state update setSeconds(prev => prev + 1) reads the latest state value on every tick without needing seconds in the dependency array.'
  },
  {
    id: 'case-8',
    title: 'Case 8: Effect Cleanup Functions (clearTimeout & clearInterval)',
    brokenCode: `useEffect(() => {
  setTimeout(() => {
    setFilteredUsers(filterUsers(query));
  }, 300);
}, [query]);`,
    fixedCode: `return () => clearTimeout(timeoutId);

return () => clearInterval(intervalId);`,
    explanation:
      'React runs an effect cleanup function before re-running the effect (when dependencies change) and when the component unmounts. clearTimeout cancels pending delayed searches when the user types another character within 300ms (preventing outdated results and wasted updates). clearInterval stops the 1-second timer when the user navigates to another exam tab so background intervals never leak or duplicate.'
  }
];

const LiveSearchTimer = () => {
  const [query, setQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(USERS);
  const [isSearching, setIsSearching] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [cleanupCount, setCleanupCount] = useState(0);
  const [showDebug, setShowDebug] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const normalized = query.trim().toLowerCase();
      const nextResults = USERS.filter(
        (user) =>
          user.name.toLowerCase().includes(normalized) ||
          user.role.toLowerCase().includes(normalized)
      );
      setFilteredUsers(nextResults);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      console.log('[Exam 2] Session timer cleaned up via clearInterval on unmount.');
    };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `(${filteredUsers.length}) Users Found | Exam 2 Live Search`;

    return () => {
      document.title = previousTitle;
    };
  }, [filteredUsers.length]);

  const updateQueryWithDebounce = (nextValue) => {
    setIsSearching(true);
    setQuery(nextValue);
    setCleanupCount((prev) => prev + 1);
  };

  const handleQueryChange = (event) => {
    updateQueryWithDebounce(event.target.value);
  };

  const handleClearSearch = () => {
    updateQueryWithDebounce('');
  };

  return (
    <section className="exam-container" aria-labelledby="exam2-heading">
      <header className="exam-header">
        <div>
          <span className="exam-tag">Practical Exam 2 • 20 pts</span>
          <h1 id="exam2-heading">Live Search and Timer</h1>
          <p className="exam-subtitle">
            Primary Hooks: <code>useEffect</code> &amp; <code>useState</code> — Debounced search
            with <code>clearTimeout</code>, 1s session timer with <code>clearInterval</code>, and{' '}
            <code>document.title</code> synchronization.
          </p>
        </div>
        <div className="header-badges">
          <span className="badge badge-primary" data-testid="session-timer">
            Session Time: {seconds}s
          </span>
          <span className="badge badge-success" data-testid="visible-results-count">
            Visible Results: {filteredUsers.length} / {USERS.length}
          </span>
        </div>
      </header>

      <div className="exam-grid">
        <div className="card">
          <h2>Directory Live Search (300ms Debounce)</h2>

          <div className="form-group">
            <label htmlFor="user-search-input">
              Search by Name or Role (try typing quickly: &quot;Developer&quot;, &quot;Ana&quot;, &quot;Tester&quot;):
            </label>
            <div className="input-with-action">
              <input
                id="user-search-input"
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Type name or role..."
                className="text-input"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClearSearch}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="status-strip">
            <span>
              Filter Status:{' '}
              <strong>
                {isSearching ? 'Debounce timer active (waiting 300ms)...' : 'Synchronized'}
              </strong>
            </span>
            <span>
              Keystrokes / Debounce Resets: <strong>{cleanupCount}</strong>
            </span>
          </div>

          <ul className="user-list" aria-live="polite">
            {filteredUsers.map((user) => (
              <li key={user.id} className="user-list-item">
                <div>
                  <strong className="user-name">{user.name}</strong>
                  <span className="user-id">ID #{user.id}</span>
                </div>
                <span className="badge badge-neutral">{user.role}</span>
              </li>
            ))}
          </ul>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <p>
                No users matched <code>&quot;{query}&quot;</code>.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClearSearch}
              >
                Reset Search Filter
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Effect Synchronization Telemetry</h2>
          <div className="telemetry-list">
            <div className="telemetry-item">
              <span className="telemetry-label">Active Browser Tab Title (document.title)</span>
              <code className="telemetry-code">
                ({filteredUsers.length}) Users Found | Exam 2 Live Search
              </code>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">Session Elapsed Seconds (1s Interval)</span>
              <strong className="telemetry-metric">{seconds} seconds</strong>
              <p className="helper-text">
                Uses <code>setSeconds((prev) =&gt; prev + 1)</code> inside <code>setInterval</code>.
                Switch to another Exam tab in the top Navbar and come back to verify the timer
                cleanly unmounts and restarts without duplicate intervals.
              </p>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">Quick Filter Presets</span>
              <div className="button-group">
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => updateQueryWithDebounce('Developer')}
                >
                  Filter &quot;Developer&quot; (2)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => updateQueryWithDebounce('Designer')}
                >
                  Filter &quot;Designer&quot; (1)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => updateQueryWithDebounce('xyz')}
                >
                  No Match &quot;xyz&quot; (0)
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => updateQueryWithDebounce('')}
                >
                  Show All (4)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="debug-panel card">
        <div className="debug-panel-header">
          <h2>Debugging &amp; Technical Explanation (Cases 6–8)</h2>
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

export default LiveSearchTimer;

import { useState } from 'react';

const DEBUGGING_CASES = [
  {
    id: 'case-1',
    title: 'Case 1: Queued State Updates & Stale Closure in addTwo (+2)',
    brokenCode: `const addTwo = () => {
  setCount(count + 1);
  setCount(count + 1);
};`,
    fixedCode: `const addTwo = () => {
  setCount((prev) => (capAtTarget ? (prev < target ? prev + 1 : prev) : prev + 1));
  setCount((prev) => (capAtTarget ? (prev < target ? prev + 1 : prev) : prev + 1));
};`,
    explanation:
      'In React, state behaves like a snapshot for a given render. Calling setCount(count + 1) twice uses the exact same captured closure value of count from that render (e.g., 0 + 1 and 0 + 1), resulting in a net increase of 1. Passing updater functions (prev => prev + 1) tells React to queue both functions and pass the latest pending state from the first update into the second update.'
  },
  {
    id: 'case-2',
    title: 'Case 2: Redundant Status State vs. Derived State',
    brokenCode: `const [count, setCount] = useState(0);
const [target, setTarget] = useState(5);
const [status, setStatus] = useState('Not started'); // Redundant state falls out of sync when target changes!`,
    fixedCode: `const [count, setCount] = useState(0);
const [target, setTarget] = useState(5);

const status =
  count === 0
    ? 'Not started'
    : count >= target
      ? 'Target reached'
      : 'In progress';`,
    explanation:
      'Storing status in its own useState requires manual synchronization inside every handler (Increment, Decrement, Reset, +2, and Target input change). Deriving status directly from count and target during rendering guarantees it is never out of sync.'
  },
  {
    id: 'case-3',
    title: 'Case 3: Unchecked Lower & Upper State Boundaries',
    brokenCode: `const decrement = () => setCount(count - 1); // Allows negative count!
<button onClick={increment}>Increment</button> // Not disabled when count >= target`,
    fixedCode: `const decrement = () => {
  setCount((prev) => (prev > 0 ? prev - 1 : 0));
};
const isAtOrAboveTarget = count >= target;
<button type="button" onClick={increment} disabled={isAtOrAboveTarget}>
  Increment (+1)
</button>`,
    explanation:
      'Decrement is guarded with Math/ternary logic (prev > 0 ? prev - 1 : 0) so count never becomes negative, and both Increment and Plus Two buttons are disabled via disabled={count >= target} to enforce the upper boundary.'
  }
];

const SmartTaskCounter = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(5);
  const [capAtTarget, setCapAtTarget] = useState(true);
  const [showDebug, setShowDebug] = useState(true);
  const [lastValidationNote, setLastValidationNote] = useState(
    'Ready. Use the controls or validation preset buttons below.'
  );

  // Derived status directly from state (no separate status useState)
  const status =
    count === 0
      ? 'Not started'
      : count >= target
        ? 'Target reached'
        : 'In progress';

  const statusBadgeClass =
    count === 0
      ? 'badge badge-neutral'
      : count >= target
        ? 'badge badge-success'
        : 'badge badge-warning';

  const isTargetReached = count >= target;

  const handleTargetChange = (event) => {
    const rawValue = Number(event.target.value);
    const safeTarget = Number.isNaN(rawValue) || rawValue < 1 ? 1 : Math.floor(rawValue);
    setTarget(safeTarget);
  };

  const handleIncrement = () => {
    setCount((prev) => (prev < target ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleReset = () => {
    setCount(0);
  };

  // Two queued functional updates as required by Exam 1
  const handleAddTwo = () => {
    setCount((prev) => (capAtTarget ? (prev < target ? prev + 1 : prev) : prev + 1));
    setCount((prev) => (capAtTarget ? (prev < target ? prev + 1 : prev) : prev + 1));
  };

  // Validation Case Helpers
  const applyPresetCase1 = () => {
    setTarget(5);
    setCount(0);
    setLastValidationNote('Case A loaded: Target = 5, Count = 0 -> Status is "Not started".');
  };

  const applyPresetCase2 = () => {
    setTarget(5);
    setCount(4);
    setLastValidationNote(
      'Case B loaded: Target = 5, Count = 4 -> Click "+2 (Queued Updates)" to verify boundary/queued update behavior.'
    );
  };

  const applyPresetCase3 = () => {
    setTarget(5);
    setCount(0);
    setLastValidationNote(
      'Case C loaded: Count = 0 -> Click "Decrement (-1)" to verify count never goes below 0.'
    );
  };

  const applyPresetCase4 = () => {
    setTarget(5);
    setCount(5);
    setLastValidationNote(
      'Case D loaded: Target reached (5/5) -> Increment & +2 are disabled. Click "Reset" to return to 0.'
    );
  };

  const progressPercentage = Math.min(100, Math.round((count / target) * 100));

  return (
    <section className="exam-container" aria-labelledby="exam1-heading">
      <header className="exam-header">
        <div>
          <span className="exam-tag">Practical Exam 1 • 20 pts</span>
          <h1 id="exam1-heading">Smart Task Counter</h1>
          <p className="exam-subtitle">
            Primary Hook: <code>useState</code> — Queued functional state updates, boundary guards,
            and derived status without redundant state.
          </p>
        </div>
        <span className={statusBadgeClass} data-testid="derived-status">
          Status: {status}
        </span>
      </header>

      <div className="exam-grid">
        <div className="card">
          <h2>Study Session Tracker</h2>

          <div className="counter-display-box">
            <div className="stat-item">
              <span className="stat-label">Completed Tasks</span>
              <span className="stat-value" data-testid="count-value">
                {count}
              </span>
            </div>
            <div className="stat-divider">/</div>
            <div className="stat-item">
              <span className="stat-label">Target Tasks</span>
              <span className="stat-value" data-testid="target-value">
                {target}
              </span>
            </div>
          </div>

          <div className="progress-bar-track" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={target}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="helper-text">
            Session Progress: <strong>{progressPercentage}%</strong> ({status})
          </p>

          <div className="form-group">
            <label htmlFor="target-tasks-input">Session Target (minimum 1):</label>
            <input
              id="target-tasks-input"
              type="number"
              min="1"
              max="100"
              value={target}
              onChange={handleTargetChange}
              className="text-input"
            />
          </div>

          <div className="checkbox-row">
            <input
              id="cap-at-target-toggle"
              type="checkbox"
              checked={capAtTarget}
              onChange={(event) => setCapAtTarget(event.target.checked)}
            />
            <label htmlFor="cap-at-target-toggle">
              Cap queued <code>+2</code> updates at <code>target</code> (
              <code>prev &lt; target ? prev + 1 : prev</code>)
            </label>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleIncrement}
              disabled={isTargetReached}
            >
              Increment (+1)
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={handleAddTwo}
              disabled={isTargetReached}
            >
              Plus Two (+2 Queued)
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDecrement}
            >
              Decrement (-1)
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleReset}
            >
              Reset (0)
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Required Validation Cases</h2>
          <p className="helper-text">
            Use these presets to quickly demonstrate all 4 required rubric validation scenarios:
          </p>

          <div className="preset-list">
            <button
              type="button"
              className="btn btn-outline"
              onClick={applyPresetCase1}
            >
              1. Target 5 &amp; Count 0 (Not started)
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={applyPresetCase2}
            >
              2. Target 5 &amp; Count 4 (Test +2 at boundary)
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={applyPresetCase3}
            >
              3. Count 0 followed by Decrement (Floor guard)
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={applyPresetCase4}
            >
              4. Target Reached (5/5) followed by Reset
            </button>
          </div>

          <div className="callout-box">
            <strong>Validation Guide:</strong>
            <p>{lastValidationNote}</p>
          </div>
        </div>
      </div>

      <div className="debug-panel card">
        <div className="debug-panel-header">
          <h2>Debugging &amp; Technical Explanation (Cases 1–3)</h2>
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

export default SmartTaskCounter;


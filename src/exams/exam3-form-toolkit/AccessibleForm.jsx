import { useState, useRef } from 'react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEBUGGING_CASES = [
  {
    id: 'case-4',
    title: 'Case 4: Replacing clicks.current in JSX with useState for Visible UI Data',
    brokenCode: `const clicks = useRef(0);
const handleTrackClick = () => {
  clicks.current += 1;
};
return <p>Clicks: {clicks.current}</p>;`,
    fixedCode: `const [clicks, setClicks] = useState(0);
const handleTrackClick = () => {
  setClicks((prev) => prev + 1);
};
return <p>Clicks: {clicks}</p>;`,
    explanation:
      'A useRef object is a plain JavaScript object ({ current: initialValue }) whose reference persists across renders. Mutating ref.current changes the property in memory silently without notifying React’s scheduler, so no re-render occurs. Any data that must visually update the UI immediately must be stored in useState.'
  },
  {
    id: 'case-5',
    title: 'Case 5: Imperative DOM Focus Order & Tracking Previous Submitted Email via useRef',
    brokenCode: `previousEmailRef.current = email;

if (errors.password) passwordRef.current.focus();
if (errors.name) nameRef.current.focus();`,
    fixedCode: `if (nextErrors.name) {
  nameInputRef.current?.focus();
} else if (nextErrors.email) {
  emailInputRef.current?.focus();
} else if (nextErrors.password) {
  passwordInputRef.current?.focus();
}

const priorSubmittedEmail = previousEmailRef.current;
previousEmailRef.current = trimmedEmail;
setLastSubmission({
  name: trimmedName,
  email: trimmedEmail,
  previousEmail: priorSubmittedEmail
});`,
    explanation:
      'DOM refs and mutable tracking refs must only be accessed inside event handlers or effects—never during rendering. Using if / else if in strict order (name -> email -> password) guarantees the first invalid field receives keyboard focus on submit, while previousEmailRef.current stores the prior email across submissions without causing an extra render.'
  }
];

const validateFormValues = ({ name, email, password }) => {
  const nextErrors = {};

  if (!name.trim()) {
    nextErrors.name = 'Full name is required. Please enter your name.';
  }

  if (!email.trim()) {
    nextErrors.email = 'Email address is required.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    nextErrors.email = 'Please enter a valid email address (e.g., student@university.edu).';
  }

  if (!password) {
    nextErrors.password = 'Password is required.';
  } else if (password.length < 8) {
    nextErrors.password = `Password must be at least 8 characters long (currently ${password.length}).`;
  }

  return nextErrors;
};

const AccessibleForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submissionCount, setSubmissionCount] = useState(0);
  const [lastSubmission, setLastSubmission] = useState(null);

  const [visibleClicks, setVisibleClicks] = useState(0);
  const [showDebug, setShowDebug] = useState(true);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const previousEmailRef = useRef('None (no prior submission yet)');

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateFormValues({ name, email, password });
    setErrors(nextErrors);

    if (nextErrors.name) {
      nameInputRef.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordInputRef.current?.focus();
      return;
    }

    const priorEmailFromRef = previousEmailRef.current;
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    previousEmailRef.current = trimmedEmail;

    setSubmissionCount((prev) => prev + 1);
    setLastSubmission({
      name: trimmedName,
      currentEmail: trimmedEmail,
      previousEmail: priorEmailFromRef,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleLoadInvalidPreset = (targetField) => {
    if (targetField === 'name') {
      setName('');
      setEmail('bad-email');
      setPassword('123');
    } else if (targetField === 'email') {
      setName('Ana Cruz');
      setEmail('invalid-email-format');
      setPassword('123');
    } else if (targetField === 'password') {
      setName('Ana Cruz');
      setEmail('ana.cruz@example.com');
      setPassword('short');
    } else if (targetField === 'valid1') {
      setName('Ana Cruz');
      setEmail('ana.first@example.com');
      setPassword('securePass123');
      setErrors({});
    } else if (targetField === 'valid2') {
      setName('Ana Cruz');
      setEmail('ana.second@example.com');
      setPassword('securePass123');
      setErrors({});
    }
  };

  return (
    <section className="exam-container" aria-labelledby="exam3-heading">
      <header className="exam-header">
        <div>
          <span className="exam-tag">Practical Exam 3 • 20 pts</span>
          <h1 id="exam3-heading">Accessible Form Toolkit</h1>
          <p className="exam-subtitle">
            Primary Hooks: <code>useRef</code> &amp; <code>useState</code> — Controlled inputs,
            strict-order invalid field focus management, and non-rendering ref tracking.
          </p>
        </div>
        <span className="badge badge-primary">
          Valid Submissions: {submissionCount}
        </span>
      </header>

      <div className="exam-grid">
        <div className="card">
          <h2>Registration Form (Strict Focus Order)</h2>
          <p className="helper-text">
            Submitting with invalid fields automatically focuses the first invalid input in strict
            order: <code>name</code> &rarr; <code>email</code> &rarr; <code>password</code>.
          </p>

          <form onSubmit={handleSubmit} noValidate className="accessible-form">
            <div className="form-group">
              <label htmlFor="reg-name-input">1. Full Name (Required):</label>
              <input
                id="reg-name-input"
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'reg-name-error' : undefined}
                placeholder="e.g., Ana Cruz"
                className={`text-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && (
                <p id="reg-name-error" className="field-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reg-email-input">2. Email Address (Valid format):</label>
              <input
                id="reg-email-input"
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'reg-email-error' : undefined}
                placeholder="e.g., ana.cruz@example.com"
                className={`text-input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && (
                <p id="reg-email-error" className="field-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reg-password-input">
                3. Password (Minimum 8 characters — currently {password.length}):
              </label>
              <input
                id="reg-password-input"
                ref={passwordInputRef}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'reg-password-error' : undefined}
                placeholder="At least 8 characters"
                className={`text-input ${errors.password ? 'input-error' : ''}`}
              />
              {errors.password && (
                <p id="reg-password-error" className="field-error" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                Submit Registration
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setPassword('');
                  setErrors({});
                }}
              >
                Clear Fields
              </button>
            </div>
          </form>

          <div className="preset-section">
            <h3>Quick Focus &amp; Ref Tracking Test Presets</h3>
            <div className="button-group">
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => handleLoadInvalidPreset('name')}
              >
                Test Invalid #1 (Focuses Name)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => handleLoadInvalidPreset('email')}
              >
                Test Invalid #2 (Focuses Email)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => handleLoadInvalidPreset('password')}
              >
                Test Invalid #3 (Focuses Password)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => handleLoadInvalidPreset('valid1')}
              >
                Load Valid Email #1
              </button>
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => handleLoadInvalidPreset('valid2')}
              >
                Load Valid Email #2
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Submission History &amp; Repaired Click Counter</h2>

          <div className="callout-box">
            <strong>Previous Email Ref Tracker (useRef):</strong>
            {lastSubmission ? (
              <div className="submission-details">
                <p>
                  <strong>Latest Submitted Name:</strong> {lastSubmission.name}
                </p>
                <p>
                  <strong>Latest Submitted Email:</strong>{' '}
                  <code data-testid="current-submitted-email">{lastSubmission.currentEmail}</code>
                </p>
                <p>
                  <strong>Previous Email (from useRef):</strong>{' '}
                  <code data-testid="previous-submitted-email">{lastSubmission.previousEmail}</code>
                </p>
                <p className="helper-text">
                  Submitted at {lastSubmission.timestamp}. Submit again with a new valid email to
                  see <code>previousEmailRef.current</code> advance on the next submission!
                </p>
              </div>
            ) : (
              <p>
                No valid submissions yet. Submit a valid email (e.g., click &quot;Load Valid Email
                #1&quot; then &quot;Submit Registration&quot;), then submit a second valid email to
                verify <code>previousEmailRef</code> tracking.
              </p>
            )}
          </div>

          <div className="repaired-demo-box">
            <h3>Repaired Debugging Fault: Visible Click Counter (useState vs. useRef)</h3>
            <p className="helper-text">
              The faulty starter code used <code>clicks.current</code> in JSX, which failed to
              re-render on click. Below is the repaired version using <code>useState</code>:
            </p>
            <div className="counter-inline">
              <span className="badge badge-success" data-testid="repaired-click-count">
                Visible UI Clicks (useState): {visibleClicks}
              </span>
              <button
                type="button"
                className="btn btn-accent btn-small"
                onClick={() => setVisibleClicks((prev) => prev + 1)}
              >
                Increment Visible Clicks (+1)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => setVisibleClicks(0)}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="debug-panel card">
        <div className="debug-panel-header">
          <h2>Debugging &amp; Technical Explanation (Cases 4–5)</h2>
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

export default AccessibleForm;


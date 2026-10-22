import { Component, useState } from 'react';
import { PreferencesProvider, usePreferences } from './PreferencesContext.jsx';

const FONT_SIZE_OPTIONS = [14, 16, 18];

const DEBUGGING_CASES = [
  {
    id: 'case-9',
    title: 'Case 9: Consumer Receiving Default Value Because No Provider Wraps the Tree',
    brokenCode: `export default function PreferencesApp() {
  return <Dashboard />;
}`,
    fixedCode: `export default function PreferencesApp() {
  return (
    <PreferencesProvider>
      <Dashboard />
    </PreferencesProvider>
  );
}`,
    explanation:
      'When useContext(PreferencesContext) runs inside a component that is not a descendant of <PreferencesContext.Provider>, React falls back to the initial argument passed to createContext(defaultValue). By wrapping the tree in <PreferencesProvider> and defaulting createContext(null) with a guard in usePreferences(), consumers always receive live state and updaters.'
  },
  {
    id: 'case-10',
    title: 'Case 10: Provider and Consumer Importing Two Separately Created Context Objects',
    brokenCode: `const PreferencesContext = createContext(null);

const PreferencesContext = createContext(null);
const prefs = useContext(PreferencesContext);`,
    fixedCode: `export const PreferencesContext = createContext(null);
export const usePreferences = () => { ... };

import { PreferencesProvider, usePreferences } from './PreferencesContext.jsx';`,
    explanation:
      'Every call to createContext() creates a unique symbol/object identity in memory. If a consumer calls useContext() with a second createContext() instance, React cannot match it to the Provider above. Exporting a single PreferencesContext and usePreferences() Hook from PreferencesContext.jsx ensures every component references the exact same Context instance.'
  },
  {
    id: 'case-11',
    title: 'Case 11: Why Moving Shared State into Context Removes Intermediate Preference Props',
    brokenCode: `<Dashboard theme={theme} fontSize={fontSize} setTheme={setTheme} setFontSize={setFontSize}>
  <Toolbar theme={theme} fontSize={fontSize} setTheme={setTheme} setFontSize={setFontSize}>
    <PreferencesPanel theme={theme} fontSize={fontSize} ... />
  </Toolbar>
</Dashboard>`,
    fixedCode: `<PreferencesProvider>
  <Dashboard />
</PreferencesProvider>

<Toolbar />
<ArticlePreview />`,
    explanation:
      'React Context broadcasts values from a Provider directly to any nested subscriber in its subtree that calls usePreferences(). Intermediate layout components like Dashboard and Toolbar no longer act as pass-through conduits for props they do not use, decoupling component signatures and simplifying maintenance.'
  }
];

export const PreferencesPanel = () => {
  const { theme, fontSize, toggleTheme, setTheme, setFontSize } = usePreferences();

  return (
    <div className="preferences-panel" data-testid="preferences-panel">
      <h3>PreferencesPanel (Level 3 Consumer)</h3>
      <p className="helper-text">
        Consumes <code>usePreferences()</code> directly without receiving props from{' '}
        <code>Dashboard</code> or <code>Toolbar</code>.
      </p>

      <div className="preferences-controls">
        <div className="control-block">
          <span className="control-label">Theme Selection:</span>
          <div className="button-group">
            <button
              type="button"
              className="btn btn-primary btn-small"
              onClick={toggleTheme}
              data-testid="toggle-theme-btn"
            >
              Toggle Theme (Current: {theme})
            </button>
            <button
              type="button"
              className={`btn btn-small ${theme === 'light' ? 'btn-accent' : 'btn-outline'}`}
              onClick={() => setTheme('light')}
            >
              Light Mode
            </button>
            <button
              type="button"
              className={`btn btn-small ${theme === 'dark' ? 'btn-accent' : 'btn-outline'}`}
              onClick={() => setTheme('dark')}
            >
              Dark Mode
            </button>
          </div>
        </div>

        <div className="control-block">
          <span className="control-label">Article Font Size (px):</span>
          <div className="button-group">
            {FONT_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                className={`btn btn-small ${fontSize === size ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => setFontSize(size)}
                data-testid={`font-size-${size}`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Toolbar = () => {
  return (
    <div className="toolbar-container">
      <div className="hierarchy-tag">Level 2: Toolbar (0 props passed)</div>
      <PreferencesPanel />
    </div>
  );
};

export const ArticlePreview = () => {
  const { theme, fontSize } = usePreferences();

  return (
    <article
      className={`article-preview theme-surface-${theme}`}
      style={{ fontSize: `${fontSize}px` }}
      data-testid="article-preview"
    >
      <div className="article-meta">
        <span className="hierarchy-tag">Level 2: ArticlePreview (0 props passed)</span>
        <span className="badge badge-primary">
          Active Style: {theme.toUpperCase()} • {fontSize}px
        </span>
      </div>
      <h3>Eliminating Prop Drilling with React Context</h3>
      <p>
        This article preview dynamically adapts its typography (currently{' '}
        <strong>{fontSize}px</strong>) and color palette (currently{' '}
        <strong>{theme}</strong> mode) by subscribing directly to{' '}
        <code>PreferencesContext</code> via our custom <code>usePreferences()</code> Hook.
      </p>
      <p>
        Notice how neither <code>Dashboard</code> nor <code>Toolbar</code> passes{' '}
        <code>theme</code> or <code>fontSize</code> as component props. Both sibling branches
        remain synchronized in real time.
      </p>
    </article>
  );
};

export const Dashboard = () => {
  const { theme, fontSize } = usePreferences();

  return (
    <div
      className={`dashboard-frame theme-dashboard-${theme}`}
      data-testid="preferences-dashboard"
    >
      <div className="dashboard-header-bar">
        <span className="hierarchy-tag">Level 1: Dashboard (Subscribed to Theme: {theme})</span>
        <span className="badge badge-neutral">
          Tree State: {theme} | {fontSize}px
        </span>
      </div>

      <div className="dashboard-content-grid">
        <Toolbar />
        <ArticlePreview />
      </div>
    </div>
  );
};

const UnwrappedConsumerProbe = () => {
  const prefs = usePreferences();
  return <div>Theme: {prefs.theme}</div>;
};

class HookErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { errorMessage: error.message };
  }

  render() {
    if (this.state.errorMessage) {
      return (
        <div className="error-banner" role="alert" data-testid="outside-provider-error">
          <strong>Caught Expected Error from &lt;UnwrappedConsumerProbe /&gt;:</strong>
          <code>{this.state.errorMessage}</code>
        </div>
      );
    }
    return this.props.children;
  }
}

const PreferencesApp = () => {
  const [mountOutsideConsumer, setMountOutsideConsumer] = useState(false);
  const [showDebug, setShowDebug] = useState(true);

  return (
    <section className="exam-container" aria-labelledby="exam4-heading">
      <header className="exam-header">
        <div>
          <span className="exam-tag">Practical Exam 4 • 20 pts</span>
          <h1 id="exam4-heading">Application Preferences</h1>
          <p className="exam-subtitle">
            Primary Hooks: <code>useContext</code> &amp; <code>useState</code> — 3-level component
            tree sharing <code>theme</code> and <code>fontSize</code> without prop drilling.
          </p>
        </div>
      </header>

      <PreferencesProvider>
        <Dashboard />
      </PreferencesProvider>

      <div className="card outside-provider-card">
        <h2>Custom Hook Guard Verification (usePreferences Outside Provider)</h2>
        <p className="helper-text">
          Requirement 5: <code>usePreferences()</code> must reject usage outside{' '}
          <code>&lt;PreferencesProvider&gt;</code> and throw a clear error message.
        </p>
        <div className="button-group">
          <button
            type="button"
            className="btn btn-danger btn-small"
            onClick={() => setMountOutsideConsumer(true)}
            data-testid="test-outside-provider-btn"
          >
            Render Consumer Outside &lt;PreferencesProvider&gt;
          </button>
          {mountOutsideConsumer && (
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => setMountOutsideConsumer(false)}
            >
              Reset Outside Consumer Test
            </button>
          )}
        </div>

        {mountOutsideConsumer && (
          <HookErrorBoundary>
            <UnwrappedConsumerProbe />
          </HookErrorBoundary>
        )}
      </div>

      <div className="debug-panel card">
        <div className="debug-panel-header">
          <h2>Debugging &amp; Technical Explanation (Cases 9–11)</h2>
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

export default PreferencesApp;

# React Practical Exam Series (Exams 1–6)

A single-repository **Vite + React** application implementing all **6 Practical Exams** (120 points total) using strictly built-in React Hooks (`useState`, `useEffect`, `useRef`, `useContext`, `useMemo`, `useCallback`, `useReducer`) and custom Hooks (`usePreferences`, `usePersistentReducer`) with zero external state management or routing libraries.

---

## 1. How to Run

From the project root directory (`mid-practical-exams/`):

```bash
npm install
npm run dev
```

Additional verification scripts:

```bash
npm run lint     # Verify zero ESLint / React Hooks rule violations
npm run build    # Verify clean production bundle via Vite
```

---

## 2. Project Architecture

```text
mid-practical-exams/
├─ package.json                      # Dependencies + scripts (npm install, npm run dev)
├─ index.html                        # Browser entry document
├─ README.md                         # Completed requirements, limitations, & test steps
├─ INSTRUCTIONS.md                   # Exam specification reference
└─ src/
   ├─ main.jsx                       # Mounts React root to the DOM
   ├─ App.jsx                        # Root component with Navbar menu switcher (Exams 1-6)
   ├─ index.css                      # Global styles for Navbar, light/dark themes, & all 6 exams
   └─ exams/
      ├─ exam1-counter/
      │  └─ SmartTaskCounter.jsx     # Exam 1: Smart Task Counter (useState)
      ├─ exam2-search-timer/
      │  └─ LiveSearchTimer.jsx      # Exam 2: Live Search and Timer (useEffect & useState)
      ├─ exam3-form-toolkit/
      │  └─ AccessibleForm.jsx       # Exam 3: Accessible Form Toolkit (useRef & useState)
      ├─ exam4-preferences/
      │  ├─ PreferencesContext.jsx   # Exam 4: Context, Provider, & usePreferences Hook
      │  └─ PreferencesApp.jsx       # Exam 4: Dashboard, Toolbar, PreferencesPanel, ArticlePreview
      ├─ exam5-performance/
      │  └─ ProductExplorer.jsx      # Exam 5: Performance Repair (useMemo, useCallback, React.memo)
      └─ exam6-issue-tracker/
         ├─ issueReducer.js          # Exam 6: Pure reducer + 3 automated unit tests
         ├─ usePersistentReducer.js  # Exam 6: Custom localStorage Hook
         └─ IssueTracker.jsx         # Exam 6: Issue Tracker UI
```

---

## 3. Completed Requirements Checklist

### Practical Exam 1: Smart Task Counter (`useState` — 20 pts)
- [x] `count` (initial `0`) and editable `target` (initial `5`) state values (`useState`).
- [x] **Increment (+1)**, **Decrement (-1)** (guarded so `count` never goes `< 0`), and **Reset (0)** controls.
- [x] **Plus Two (+2)** control implemented with two queued functional updates (`prev => ...`).
- [x] Derived status (`Not started`, `In progress`, `Target reached`) computed directly during render without a redundant `status` state variable.
- [x] Upper boundary button disabling (`disabled={count >= target}`) for Increment and Plus Two.
- [x] Interactive preset buttons for all 4 required validation cases + Debugging Cases 1–3 panel.

### Practical Exam 2: Live Search and Timer (`useEffect` & `useState` — 20 pts)
- [x] Uses the exact 4 `USERS` starter records (`Ana Cruz`, `Ben Lim`, `Cara Yu`, `Dan Go`).
- [x] Delayed search filter (`300ms` `setTimeout`) inside `useEffect` triggered when `query` changes.
- [x] Cleanup function returning `clearTimeout(timeoutId)` so rapid typing cancels outdated searches.
- [x] 1-second session timer (`setInterval`) using functional updates (`setSeconds(prev => prev + 1)`).
- [x] Unmount cleanup (`clearInterval(intervalId)`) verified when switching tabs in `App.jsx`.
- [x] `document.title` synchronized with visible result count inside `useEffect` + Debugging Cases 6–8 panel.

### Practical Exam 3: Accessible Form Toolkit (`useRef` & `useState` — 20 pts)
- [x] Controlled `name`, `email`, and `password` inputs driven by `useState`.
- [x] Three DOM refs (`nameInputRef`, `emailInputRef`, `passwordInputRef`) attached via `ref` attributes.
- [x] Submit validation for required `name`, valid `email` format, and `password.length >= 8` with accessible `role="alert"` error messages.
- [x] Automatic `.focus()` on the first invalid field in strict order: `name` $\rightarrow$ `email` $\rightarrow$ `password`.
- [x] Tracks previously submitted email in `previousEmailRef` (`useRef`) without triggering a re-render, surfacing it after the next valid submission.
- [x] Zero reads or writes to `ref.current` during render + repaired `useState` visible click counter demo + Debugging Cases 4–5 panel.

### Practical Exam 4: Application Preferences (`useContext` & `useState` — 20 pts)
- [x] Single `PreferencesContext` and `PreferencesProvider` exported from `PreferencesContext.jsx`.
- [x] Exact 3-level hierarchy (`App` $\rightarrow$ `PreferencesProvider` $\rightarrow$ `Dashboard` $\rightarrow$ `Toolbar` $\rightarrow$ `PreferencesPanel` and `ArticlePreview`) with **zero prop drilling** through `Dashboard` or `Toolbar`.
- [x] Toggles `light` and `dark` themes across `Dashboard` and `ArticlePreview` simultaneously.
- [x] Switches font size among `14`, `16`, and `18` pixels in `PreferencesPanel` and updates `ArticlePreview`.
- [x] Custom `usePreferences()` Hook that throws a clear error when called outside `<PreferencesProvider>`, complete with a safe ErrorBoundary UI test button + Debugging Cases 9–11 panel.

### Practical Exam 5: Product Explorer Performance Repair (`useMemo` & `useCallback` — 20 pts)
- [x] Deterministically generates **520 product records** outside the component.
- [x] Text search (name/SKU), category filter, and price sort order (`asc`/`desc`).
- [x] `ProductList` wrapped in `React.memo` with both `console.log` and a visual render badge.
- [x] Filtered and sorted product array memoized with `useMemo` and complete dependencies `[query, category, sortOrder]`.
- [x] Item selection handler memoized with `useCallback` and complete dependencies `[projectTag]`.
- [x] Unrelated parent counter button proving `ProductList` does **not** re-render on unrelated parent state changes.
- [x] Analytics logging moved out of `useMemo` and into `useEffect` + Debugging Cases 12–14 panel.

### Practical Exam 6: Issue Tracker State Engine (`useReducer` & Custom Hook — 20 pts)
- [x] Pure, immutable `issueReducer` with exact state shape `{ issues: [], filter: 'all', nextId: 1 }`.
- [x] Implements all 5 required actions (`ADD_ISSUE`, `TOGGLE_ISSUE`, `DELETE_ISSUE`, `SET_FILTER`, `CLEAR_DONE`) plus `default: return state`.
- [x] Custom `usePersistentReducer` Hook using lazy initialization (`localStorage.getItem` via `useReducer` 3rd init argument) and `useEffect` synchronization (`localStorage.setItem`).
- [x] Filter views for **All**, **Open**, and **Done** with accurate live badge counters.
- [x] Three automated reducer unit tests (`ADD_ISSUE`, `TOGGLE_ISSUE`, `CLEAR_DONE`) runnable from the UI and logged to the console + Debugging Cases 15–17 panel.

---

## 4. Known Limitations

- **Client-Side Persistence Scope:** Exam 6 persists issues in browser `localStorage` under the key `exam6_issue_tracker_state_v1`. Clearing browser site data or opening an incognito session resets the list to the initial state.
- **Viewport Table Slice in Exam 5:** All 520 generated products are filtered and sorted inside `useMemo` on every query/category/sort change; the table renders the top 40 matching items in a scrollable container to keep DOM inspection fast during live grading.
- **No URL Routing:** By design (Course Rule #8), navigation between Exams 1–6 uses `useState` conditional rendering in `src/App.jsx` rather than `react-router-dom`.

---

## 5. Step-by-Step Test & Validation Procedures

### Testing Exam 1 (`SmartTaskCounter`)
1. Open **Exam 1** in the top Navbar. Verify initial state shows **Completed Tasks: 0**, **Target Tasks: 5**, and badge **Status: Not started**.
2. Click **Preset 3 (Count 0 followed by Decrement)**, then click **Decrement (-1)**. Verify `count` stays at `0` (never negative).
3. Click **Plus Two (+2 Queued)** twice to reach `4`. Verify status changes to **In progress**.
4. With **Count = 4, Target = 5**, click **Plus Two (+2 Queued)**:
   - With *"Cap queued +2 updates at target"* checked, the two queued updates increment `4 -> 5` and cap at `5`.
   - Uncheck the cap toggle and repeat from `4` if you wish to observe uncapped `+2` (`4 -> 6`).
5. Verify that once `count >= target`, **Status** displays **Target reached** and both **Increment (+1)** and **Plus Two (+2 Queued)** are disabled.
6. Click **Reset (0)** and verify `count` returns to `0` and buttons re-enable.

### Testing Exam 2 (`LiveSearchTimer`)
1. Switch to **Exam 2**. Observe the **Session Time** badge incrementing by `1` every second (`setInterval` with `prev => prev + 1`).
2. Type `Developer` rapidly into the search input. Notice the status indicator shows the `300ms` debounce delay before filtering down to `Ana Cruz` and `Dan Go` (`2 / 4` visible).
3. Check the browser tab title (`document.title`); verify it updates to `(2) Users Found | Exam 2 Live Search`.
4. Switch to **Exam 1** and check the browser DevTools console to see `[Exam 2] Session timer cleaned up via clearInterval on unmount.` Switch back to **Exam 2** and verify the timer starts cleanly from `0s` with no duplicate ticks.

### Testing Exam 3 (`AccessibleForm`)
1. Switch to **Exam 3**. Leave all fields blank and click **Submit Registration**.
2. Verify all 3 validation messages appear and the browser cursor automatically focuses the **Full Name** input (`name` $\rightarrow$ `email` $\rightarrow$ `password` priority).
3. Click **Test Invalid #2 (Focuses Email)** and click **Submit Registration**. Verify focus jumps directly to the **Email Address** input.
4. Click **Test Invalid #3 (Focuses Password)** and click **Submit Registration**. Verify focus jumps directly to the **Password** input.
5. Click **Load Valid Email #1** (`ana.first@example.com`) and submit. Observe `Previous Email (from useRef): None (no prior submission yet)`.
6. Click **Load Valid Email #2** (`ana.second@example.com`) and submit. Verify `Previous Email (from useRef)` now displays `ana.first@example.com`.

### Testing Exam 4 (`PreferencesApp`)
1. Switch to **Exam 4**. Click **Toggle Theme** inside `PreferencesPanel` (Level 3). Verify both `Dashboard` (Level 1) and `ArticlePreview` (Level 2) switch between `light` and `dark` mode without any props passed through `Dashboard` or `Toolbar`.
2. Click **14px**, **16px**, and **18px** in `PreferencesPanel`. Verify `ArticlePreview` text size updates immediately.
3. Click **Render Consumer Outside `<PreferencesProvider>`**. Verify `usePreferences()` throws the expected error and the UI displays the caught error message cleanly.

### Testing Exam 5 (`ProductExplorer`)
1. Switch to **Exam 5** and open the browser DevTools Console.
2. Note the badge `ProductList Render Count: #1` (or current count).
3. Click **Increment Unrelated Parent Counter** multiple times. Verify the parent counter badge increments while **ProductList Render Count does NOT increment** and no new `[Exam 5] <ProductList /> rendered` message appears in the console.
4. Change **Category Filter** to `Audio` or **Price Sort Order** to `DESC`. Verify `useMemo` recomputes, `ProductList` re-renders with updated items, and `[Exam 5 Analytics]` logs inside `useEffect`.
5. Change **Active Project Tag** and click **Select** on any product row. Verify `handleSelectProduct` (`useCallback`) uses the latest `projectTag`.

### Testing Exam 6 (`IssueTracker`)
1. Switch to **Exam 6**. Observe the **Automated Reducer Unit Tests** card showing **PASS** for all 3 required tests (`ADD_ISSUE`, `TOGGLE_ISSUE`, `CLEAR_DONE`). Click **Re-Run 3 Reducer Unit Tests** to log `console.table(results)` in DevTools.
2. Click **+ Seed 3 Sample Issues** or add custom issues via the input box.
3. Toggle an issue to **Done**, switch between **All**, **Open**, and **Done** filter tabs, and verify counts remain accurate.
4. Refresh the browser page (`F5`) and return to **Exam 6**—verify all issues and filter state persist via `usePersistentReducer` (`localStorage`).
5. Click **Clear Done** to remove completed issues, and click **Test Unknown Action (Default Branch)** to verify unrecognized actions safely return the existing state.

---

## 6. When Memoization Is Unnecessary (Exam 5 Deliverable)

Memoization (`useMemo` and `useCallback`) is **not free**: every render must allocate a dependency array, store the cached value in fiber hooks memory, and iterate over dependencies with `Object.is()`.

### Unnecessary Memoization Example
```jsx
// UNNECESSARY: Wrapping a cheap O(1) primitive boolean check in useMemo
const isFilterActive = useMemo(() => {
  return query.trim() !== '' || category !== 'All' || sortOrder !== 'asc';
}, [query, category, sortOrder]);
```

### Preferred Direct Calculation
```jsx
// PREFERRED: Compute cheap primitive values directly during render
const isFilterActive =
  query.trim() !== '' || category !== 'All' || sortOrder !== 'asc';
```

### Technical Explanation
1. **Negligible Computation Cost:** Comparing three short strings is an $O(1)$ operation taking nanoseconds—less work than React’s `useMemo` dependency array allocation and comparison loop.
2. **Value Equality of Primitives:** `isFilterActive` evaluates to a primitive `boolean` (`true` or `false`). Unlike objects, arrays, or functions, JavaScript compares booleans by value (`true === true`), so recomputing a boolean during render never breaks `React.memo` reference equality in child props.

---

## 7. Complete Debugging Walkthrough (Cases 1–17)

### Exam 1 (`SmartTaskCounter.jsx`)
- **Case 1 (Queued Updates Closure Fault):**
  - *Broken:* `setCount(count + 1); setCount(count + 1);`
  - *Fixed:* `setCount(prev => (prev < target ? prev + 1 : prev)); setCount(prev => (prev < target ? prev + 1 : prev));`
  - *Why:* `count` is a constant snapshot for the current render. Calling `setCount(count + 1)` twice reads the same captured `count` value both times. Passing an updater function `prev => ...` queues both updates so the second receives the output of the first.
- **Case 2 (Redundant Derived Status State):**
  - *Broken:* Storing `const [status, setStatus] = useState('Not started')` and manually updating it.
  - *Fixed:* Computing `const status = count === 0 ? 'Not started' : count >= target ? 'Target reached' : 'In progress';` during render.
  - *Why:* Derived state stored in `useState` easily falls out of sync when `target` or `count` changes through multiple handlers.
- **Case 3 (Boundary Violations):**
  - *Broken:* Unchecked `setCount(count - 1)` and enabled Increment buttons after `count >= target`.
  - *Fixed:* Guarded decrement `setCount(prev => (prev > 0 ? prev - 1 : 0))` and added `disabled={count >= target}` on Increment and +2 buttons.

### Exam 3 (`AccessibleForm.jsx`)
- **Case 4 (`clicks.current` Not Updating UI):**
  - *Broken:* Mutating `clicks.current += 1` and rendering `{clicks.current}` in JSX.
  - *Fixed:* Replaced with `const [visibleClicks, setVisibleClicks] = useState(0)`.
  - *Why:* `useRef` returns a plain mutable object `{ current }`. Mutating `.current` does not notify React to schedule a re-render, and reading `ref.current` during render violates pure rendering rules.
- **Case 5 (Imperative Focus Order & Non-Rendering Previous Email Tracker):**
  - *Broken:* Writing `previousEmailRef.current` during render or focusing invalid inputs in arbitrary order.
  - *Fixed:* Inside `handleSubmit`, check `if (nextErrors.name)` $\rightarrow$ `else if (nextErrors.email)` $\rightarrow$ `else if (nextErrors.password)` and call `.focus()`. On valid submit, read `previousEmailRef.current` and update it inside `handleSubmit`.

### Exam 2 (`LiveSearchTimer.jsx`)
- **Case 6 (Infinite Effect Loop):**
  - *Broken:* `useEffect(() => { setFilteredUsers(USERS.filter(...)); }, [query, filteredUsers]);`
  - *Fixed:* Removed `filteredUsers` from the dependency array so the effect depends only on `[query]`.
  - *Why:* `.filter()` creates a new array reference on every run; depending on the state that the effect sets causes an endless render loop.
- **Case 7 (Stale Closure in `setInterval` Stuck at 1):**
  - *Broken:* `setInterval(() => { setSeconds(seconds + 1); }, 1000)` with `[]` dependencies.
  - *Fixed:* `setInterval(() => { setSeconds(prev => prev + 1); }, 1000)`.
  - *Why:* With `[]`, the interval callback closes over the initial render's `seconds = 0` forever (`0 + 1 = 1`). Using `prev => prev + 1` always increments the latest pending state.
- **Case 8 (Cleanup Functions `clearTimeout` & `clearInterval`):**
  - *Broken:* Starting `setTimeout` and `setInterval` inside `useEffect` without returning cleanup functions.
  - *Fixed:* Returned `() => clearTimeout(timeoutId)` from the search effect and `() => clearInterval(intervalId)` from the timer effect.
  - *Why:* Cleanup cancels in-flight search timers when `query` changes rapidly and stops the 1-second interval when Exam 2 unmounts.

### Exam 4 (`PreferencesContext.jsx` & `PreferencesApp.jsx`)
- **Case 9 (Missing Provider Wrapper):**
  - *Broken:* Rendering `<Dashboard />` without wrapping it in `<PreferencesProvider>`.
  - *Fixed:* Wrapped `<Dashboard />` inside `<PreferencesProvider>` and added a null-check guard in `usePreferences()`.
- **Case 10 (Duplicate Context Instances):**
  - *Broken:* Calling `createContext()` separately in both the provider file and consumer file.
  - *Fixed:* Exported one shared `PreferencesContext` and `usePreferences` Hook from `PreferencesContext.jsx`.
- **Case 11 (Eliminating Prop Drilling):**
  - *Broken:* Passing `theme`, `fontSize`, `setTheme`, and `setFontSize` through `Dashboard` and `Toolbar` props.
  - *Fixed:* `Dashboard` and `Toolbar` accept zero props; `PreferencesPanel` and `ArticlePreview` consume `usePreferences()` directly.

### Exam 5 (`ProductExplorer.jsx`)
- **Case 12 (Missing `query` Dependency in `useMemo`):**
  - *Broken:* `useMemo(() => filterAndSort(...), [category, sortOrder])` (missing `query`).
  - *Fixed:* Added `query` to the dependency array: `[query, category, sortOrder]`.
- **Case 13 (Missing Dependency in `useCallback`):**
  - *Broken:* `useCallback((product) => setSelectedRecord({ product, assignedProject: projectTag }), [])`.
  - *Fixed:* Added `[projectTag]` to the `useCallback` dependency array so selection always records the current project tag.
- **Case 14 (Side Effect Inside `useMemo`):**
  - *Broken:* Calling analytics logging / state updates inside `useMemo`.
  - *Fixed:* Kept `useMemo` 100% pure and moved analytics logging into `useEffect([query, category, sortOrder, visibleProducts.length])`.

### Exam 6 (`issueReducer.js`, `usePersistentReducer.js`, `IssueTracker.jsx`)
- **Case 15 (Direct State Mutation in Reducer):**
  - *Broken:* Using `state.issues.push(...)` and returning the mutated `state` object.
  - *Fixed:* Returned a new state object `{ ...state, issues: [...state.issues, newIssue], nextId: state.nextId + 1 }` and mapped toggled issues with `{ ...issue, done: !issue.done }`.
- **Case 16 (Mismatched Action Payload Shape):**
  - *Broken:* Dispatching `{ type: 'ADD_ISSUE', title }` while the reducer reads `action.payload.title`.
  - *Fixed:* Standardized all dispatches to `{ type, payload: { ... } }` and guarded reads with `action.payload?.title`.
- **Case 17 (Default Branch Returning `undefined`):**
  - *Broken:* `default: return undefined;` in `switch (action.type)`.
  - *Fixed:* `default: return state;` so unknown actions never corrupt reducer state.

# Project Instructions: React Practical Exam Series (1-6)

## 1. Project Overview & Architecture
You are building a single-repository **Vite + React** application[cite: 1, 9] that houses **6 Practical Exams** (worth 20 points each, 120 points total)[cite: 1]. 
- **Single Repo Navigation:** The root `App.jsx`[cite: 9] must contain a top **Navbar / Menu Switcher** using `useState`[cite: 1] so the user/instructor can switch between Exam 1 through Exam 6[cite: 1].
- **True Component Unmounting:** Conditional rendering[cite: 10] in `App.jsx`[cite: 9] must mount only the active exam component at a time so that switching tabs properly triggers component unmount cleanup (critical for demonstrating Exam 2's timer cleanup)[cite: 3].
- **Build Tool & Commands:** The project must be built with **Vite** (not deprecated Create React App)[cite: 9] and must run cleanly with `npm install` followed by `npm run dev`[cite: 1].
- **No External State Libraries:** Do NOT install external state management libraries (e.g., Redux, Zustand, MobX)[cite: 1]. Use **only** React Hooks (`useState`, `useEffect`, `useRef`, `useContext`, `useMemo`, `useCallback`, `useReducer`) and custom Hooks[cite: 1].
- **Submission Rule:** Submit the complete project folder without `node_modules` (ensure `.gitignore` excludes `node_modules`)[cite: 1, 9].

### Recommended Directory Structure
```text
mid-practical-exams/
├─ package.json                      # Dependencies + scripts (npm install, npm run dev)[cite: 1, 9]
├─ index.html                        # Browser entry document[cite: 9]
├─ README.md                         # Completed requirements, limitations, & test steps[cite: 1]
├─ instructions.md
└─ src/                              # Edit mostly inside src/[cite: 9]
   ├─ main.jsx                       # Mounts React to the DOM[cite: 9]
   ├─ App.jsx                        # Root component with Navbar menu switcher (Exams 1-6)[cite: 1, 9]
   ├─ index.css                      # Global styles for Navbar & all 6 exams[cite: 9]
   └─ exams/
      ├─ exam1-counter/
      │  └─ SmartTaskCounter.jsx     # Exam 1: Smart Task Counter (useState)[cite: 1, 2]
      ├─ exam2-search-timer/
      │  └─ LiveSearchTimer.jsx      # Exam 2: Live Search and Timer (useEffect & useState)[cite: 1, 3]
      ├─ exam3-form-toolkit/
      │  └─ AccessibleForm.jsx       # Exam 3: Accessible Form Toolkit (useRef & useState)[cite: 1, 4]
      ├─ exam4-preferences/
      │  ├─ PreferencesContext.jsx   # Exam 4: Context, Provider, & usePreferences Hook[cite: 1, 5]
      │  └─ PreferencesApp.jsx       # Exam 4: Dashboard, Toolbar, Panel, ArticlePreview[cite: 5]
      ├─ exam5-performance/
      │  └─ ProductExplorer.jsx      # Exam 5: Performance Repair (useMemo & useCallback)[cite: 1, 6]
      └─ exam6-issue-tracker/
         ├─ issueReducer.js          # Exam 6: Pure reducer + 3 sample test cases[cite: 1, 7]
         ├─ usePersistentReducer.js  # Exam 6: Custom localStorage Hook[cite: 7]
         └─ IssueTracker.jsx         # Exam 6: Issue Tracker UI[cite: 1, 7]
```

---

## 2. Course Coding Standards (Strict Alignment with Class Lessons)
All generated code must strictly follow these JavaScript & React rules from our class lectures:
1. **Modern Declarations:** Use `const` and `let` only, and avoid `var` in modern React projects[cite: 10]. Remember that a `const` variable cannot be reassigned[cite: 12], and `let`/`const` are block-scoped[cite: 10, 12].
2. **Component Naming & Exports:** All custom React component names must begin with a capital letter (e.g., `SmartTaskCounter`)[cite: 9, 11] and use proper ES module `export default` or named exports (`export const`) with matching imports[cite: 9, 10, 11, 13].
3. **Strict JSX Rules:**
   - Every JSX tag must be explicitly closed or self-closed (`<img />`, `<input />`, `<textarea id="bio"></textarea>`)[cite: 9, 14].
   - Use camelCase attributes (`onClick`, `tabIndex`) and React DOM attribute names: `className` instead of `class`, and `htmlFor` instead of `for`[cite: 9, 14].
   - Always connect `<label htmlFor="id">` to its corresponding `<input id="id" />`[cite: 9, 14].
   - Every component must return one single parent element (`<div>...</div>`) or a React Fragment (`<>...</>`)[cite: 9, 11, 14].
   - Only embed JavaScript **expressions** inside `{}` (variables, arithmetic, function calls, conditional ternary `cond ? a : b`, logical `&&`, nullish coalescing `??`, optional chaining `?.`)[cite: 9, 10, 13, 14]. Never put `if`, `for`, or `while` statements inside JSX `{}`[cite: 9, 14].
4. **Callbacks & Event Handlers:**
   - Pass function references (`onClick={handleClick}`) or arrow function wrappers (`onClick={() => deleteStudent(id)}`)[cite: 10, 12, 14].
   - Never invoke functions immediately during rendering (`onClick={handleClick()}` is forbidden because it runs immediately during rendering)[cite: 10, 12].
5. **Props & Object Destructuring:**
   - Destructure incoming props cleanly in function parameters: `const Student = ({ name, course }) => { ... }` rather than treating props as separate parameters `(name, course)`[cite: 10, 12].
6. **Array Transformations & List Keys:**
   - Use `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, and `.reduce()` instead of manual loops[cite: 10, 12].
   - When using arrow functions with curly braces `{}` inside `.map()`, always include an explicit `return` statement, or use implicit return without braces[cite: 12, 13].
   - Every element generated via `.map()` must have a unique `key={item.id}` prop[cite: 10, 12].
7. **Strict Immutability & Reference Equality:**
   - Never mutate state arrays or objects directly (no `.push()` or `obj.prop = value`, as `.push()` mutates the old array and preserves its memory reference)[cite: 10, 13].
   - Always create new copies using spread syntax (`[...items, newItem]`, `{ ...obj, prop: newValue }`), `.map()`, or `.filter()`[cite: 7, 10, 13].
8. **UI Debugging Evidence Panel:**
   - Because each exam grades "Debugging evidence (3 pts)" and "Demonstration and testing (2 pts)"[cite: 8], include a clearly styled **"Debugging & Technical Explanation"** card at the bottom of each Exam component that displays the repaired faults and explanations so the student can demonstrate them live[cite: 1, 8].

---

## 3. Detailed Specifications for All 6 Practical Exams

### Practical Exam 1: Smart Task Counter (20 pts)
- **Primary Hook:** `useState` (Foundational)[cite: 2]
- **Scenario:** Build a compact task counter for a study session that tracks completed tasks, the target number of tasks, and a status message derived from state[cite: 2].
- **Functional Requirements:**
  1. **State Values (4 pts):** Create `count` (initial `0`) and `target` (initial `5`, editable via input) state values with valid initial values so both appear and update correctly[cite: 2].
  2. **Controls (5 pts):** Add **Increment**, **Decrement**, and **Reset** controls. `count` must never become negative (`< 0`), and Reset returns `count` to `0`[cite: 2].
  3. **Plus Two Queued Updates (4 pts):** Add a **plus two (+2)** control using **two queued functional updates** so one click increases `count` by exactly two[cite: 2]:
     ```js
     const addTwo = () => {
       setCount(prev => (prev < target ? prev + 1 : prev));
       setCount(prev => (prev < target ? prev + 1 : prev));
     };
     ```
     *(Provide a toggle or support both exact +2 functional updates and target-capped functional updates so both the "+2 increases by two" and "Target 5, Count 4 followed by plus two" validation cases can be demonstrated clearly)[cite: 2].*
  4. **Derived Status (4 pts):** Display `Not started` (`count === 0`), `In progress` (`count > 0 && count < target`), or `Target reached` (`count >= target`) derived directly from current state **without** creating a separate status state variable[cite: 2].
  5. **Boundary Disabling (3 pts):** Disable Increment and plus two buttons after reaching the target (`count >= target`) so buttons respond correctly at the boundary[cite: 2].
- **Required Debugging Case:**
  - *Faulty Handler:*
    ```js
    const addTwo = () => {
      setCount(count + 1);
      setCount(count + 1);
    };
    ```
  - *Task:* Repair it using functional updates (`prev => prev + 1`) and explain why React processes both original calls from the same captured closure value (`count`) during that render[cite: 2, 10, 13].
- **Validation Cases to Demonstrate:**
  - Target `5` and count `0`[cite: 2]
  - Count `4` followed by plus two[cite: 2]
  - Count `0` followed by Decrement[cite: 2]
  - Reset after the target is reached[cite: 2]

---

### Practical Exam 2: Live Search and Timer (20 pts)
- **Primary Hooks:** `useEffect` and `useState` (45 minutes, Developing)[cite: 3]
- **Scenario:** Build a searchable user list with a session timer using supplied local data so the exam does not depend on internet access[cite: 3].
- **Required Starter Data:**
  ```js
  const USERS = [
    { id: 1, name: 'Ana Cruz', role: 'Developer' },
    { id: 2, name: 'Ben Lim', role: 'Designer' },
    { id: 3, name: 'Cara Yu', role: 'Tester' },
    { id: 4, name: 'Dan Go', role: 'Developer' }
  ];
  ```
 [cite: 3]
- **Functional Requirements:**
  1. **Delayed Filter Effect (4 pts):** Filter `USERS` after the `query` changes inside a `useEffect` using a short `setTimeout` delay (e.g., `300ms`) to simulate a search request[cite: 3].
  2. **Cancel Previous Search (4 pts):** Return a cleanup function (`clearTimeout`) from the search effect so fast typing cancels the previous delayed search and does not display an outdated result[cite: 3].
  3. **One-Second Session Timer (4 pts):** Run a 1-second session timer (`setInterval`) where elapsed seconds increase once per second[cite: 3].
  4. **Unmount Cleanup (4 pts):** Clean up the timer on unmount (`clearInterval`) so no duplicate timer continues after navigation or remount[cite: 3].
  5. **Document Title Sync (4 pts):** Show the number of visible results in `document.title` inside a `useEffect` so the title synchronizes whenever the result count changes[cite: 3].
- **Required Debugging Cases:**
  - *Case 6:* Repair an effect that depends on the same state value it updates and therefore runs repeatedly in an infinite loop[cite: 3].
  - *Case 7:* Repair a timer callback that captures the initial `seconds` value in a closure and remains stuck at `1` (fix using `setSeconds(prev => prev + 1)`)[cite: 3, 10, 13].
  - *Case 8:* Explain the cleanup functions used for the delayed search (`clearTimeout`) and interval (`clearInterval`)[cite: 3].

---

### Practical Exam 3: Accessible Form Toolkit (20 pts)
- **Primary Hooks:** `useRef` and `useState` (Developing)[cite: 4]
- **Scenario:** Build a registration form that guides the user to invalid fields while preserving render-driven form values in state[cite: 4].
- **Functional Requirements:**
  1. **Controlled Inputs (4 pts):** Create `name`, `email`, and `password` inputs controlled by state so values remain visible and editable[cite: 4].
  2. **Input Refs (3 pts):** Create refs (`useRef`) for the three input elements and attach each through the `ref` attribute[cite: 4].
  3. **Validation (5 pts):** Validate required `name`, valid `email` structure, and 8-character `password` (`>= 8` chars), ensuring all invalid fields receive readable messages[cite: 4].
  4. **Focus First Invalid Field (4 pts):** Focus (`.focus()`) the first invalid field after submission in strict focus order: `name`, `email`, then `password`[cite: 4].
  5. **Track Previous Email Without Render (4 pts):** Track the previous submitted email in a `useRef` without causing a render, and ensure the previous value appears in the UI after the next successful submission[cite: 4].
  6. **Strict Restriction:** Do NOT read or write `ref.current` during rendering except for predictable initialization. Access DOM refs and update tracking refs strictly inside event handlers or effects[cite: 4].
- **Required Debugging Case:**
  - *Fault:* The starter code displays `clicks.current` in the interface, but the display does not update[cite: 4].
  - *Task:* Replace the ref with `useState` for visible data and state why `ref` mutation does not schedule a render[cite: 4].

---

### Practical Exam 4: Application Preferences (20 pts)
- **Primary Hooks:** `useContext` and `useState` (Intermediate)[cite: 5]
- **Scenario:** Build a small three-level component tree that shares `theme` and `fontSize` preferences without passing preference props through every level[cite: 5].
- **Required Component Tree:**
  ```text
  App
   └─ PreferencesProvider
       └─ Dashboard
           ├─ Toolbar
           │   └─ PreferencesPanel
           └─ ArticlePreview
  ```
 [cite: 5]
- **Functional Requirements:**
  1. **Single Context & Provider (4 pts):** Create one context (`PreferencesContext`) and a `PreferencesProvider` component so all consumers import the exact same context object[cite: 5].
  2. **Shared Values & Updaters (4 pts):** Share `theme`, `fontSize`, and update functions via context so nested components access all required values[cite: 5].
  3. **Theme Toggle (4 pts):** Toggle `light` and `dark` themes so `Dashboard` and `ArticlePreview` update together[cite: 5].
  4. **Font Size Control (4 pts):** Change font size among `14`, `16`, and `18` pixels in `PreferencesPanel` so `ArticlePreview` changes without prop drilling[cite: 5].
  5. **Custom Access Hook (4 pts):** Create `usePreferences` and reject use outside the provider so the custom access Hook returns context or throws a clear error[cite: 5]. (Include a safe demo button in the UI that catches and displays the thrown error when rendered outside the provider).
- **Required Debugging Cases:**
  - *Case 9:* Repair a consumer that receives only the default value because no provider wraps the tree[cite: 5].
  - *Case 10:* Repair a project where the provider and consumer import two separately created context objects[cite: 5].
  - *Case 11:* Explain why moving shared state into context removes intermediate preference props[cite: 5].

---

### Practical Exam 5: Product Explorer Performance Repair (20 pts)
- **Primary Hooks:** `useMemo` and `useCallback` (50 minutes, Intermediate)[cite: 6]
- **Scenario:** Repair a product explorer that performs an expensive filter and sends a new callback to a memoized child during every parent render[cite: 6].
- **Starter Constraints:**
  - Use at least **500 generated product records**[cite: 6].
  - Provide text search, category selection, and price sorting[cite: 6].
  - Wrap `ProductList` with `React.memo`[cite: 6].
  - Include an unrelated counter in the parent to test unnecessary work[cite: 6].
- **Functional Requirements:**
  1. **Memoize Product List (5 pts):** Memoize the filtered and sorted product list with `useMemo` so the calculation reruns only when its true inputs (`query`, `category`, `sortOrder`) change[cite: 6].
  2. **Memoize Callback (4 pts):** Memoize the item selection callback with `useCallback` so the callback reference stays stable until a required dependency changes[cite: 6, 10, 13].
  3. **Prevent Unnecessary Child Renders (4 pts):** Prevent `ProductList` from rerendering for the unrelated counter and log to `console.log` (plus show a visual render counter in the UI) so console evidence shows stable child rendering[cite: 6].
  4. **Complete Dependency Arrays (4 pts):** Keep all dependency arrays complete so search, category, sort order, and selected behavior stay current[cite: 6].
  5. **Document Unnecessary Memoization (3 pts):** Document one case in `README.md` (and on-screen) where memoization would be unnecessary with a technically accurate example[cite: 6].
- **Required Debugging Cases:**
  - *Case 12:* Add a missing `query` dependency to a `useMemo` calculation that displays stale results[cite: 6].
  - *Case 13:* Add a missing project or selected value dependency to a `useCallback` that uses outdated data[cite: 6].
  - *Case 14:* Move an analytics call out of `useMemo` and into `useEffect`[cite: 6].

---

### Practical Exam 6: Issue Tracker State Engine (20 pts)
- **Primary Hooks:** `useReducer` and custom Hooks (60 minutes, Advanced)[cite: 7]
- **Scenario:** Build an issue tracker whose state transitions are handled by a pure reducer, and extract persistence into a custom Hook[cite: 7].
- **Required State Shape:**
  ```js
  {
    issues: [],
    filter: 'all',
    nextId: 1
  }
  ```
  [cite: 7]
- **Required Actions:**
  - `ADD_ISSUE` — `payload: { title }`[cite: 7]
  - `TOGGLE_ISSUE` — `payload: { id }`[cite: 7]
  - `DELETE_ISSUE` — `payload: { id }`[cite: 7]
  - `SET_FILTER` — `payload: { filter }`[cite: 7]
  - `CLEAR_DONE` — (clears completed issues)[cite: 7]
- **Functional Requirements:**
  1. **Implement All 5 Actions (5 pts):** Implement all five reducer actions so every transition returns the expected next state[cite: 7].
  2. **Pure & Immutable Reducer (4 pts):** Keep the reducer pure and immutable so no existing state object or issue object is mutated[cite: 7, 10, 13].
  3. **Default Branch (2 pts):** Preserve state for unknown actions so the `default` branch returns the existing `state`[cite: 7].
  4. **Custom Persistent Hook (4 pts):** Create `usePersistentReducer` using `localStorage` so state loads once (lazy initialization) and saves inside `useEffect` after state changes[cite: 7].
  5. **Filter Views & Counts (3 pts):** Show **All**, **Open**, and **Done** issue views so filtering works and the counts remain accurate[cite: 7].
  6. **Three Reducer Tests (2 pts):** Add three reducer tests using sample states and actions covering `ADD_ISSUE`, `TOGGLE_ISSUE`, and `CLEAR_DONE` behavior (runnable from the UI and logged to the console)[cite: 7].
- **Required Debugging Cases:**
  - *Case 15:* Replace direct state mutation with a new state object and new issue objects where changes occur[cite: 7, 10, 13].
  - *Case 16:* Repair a mismatched action shape in which the reducer reads `action.payload` but `dispatch` sends `action.title`[cite: 7].
  - *Case 17:* Repair a `default` branch that returns `undefined` instead of `state`[cite: 7].

---

## 4. Grading Rubric & README Deliverables
Ensure the project satisfies every full-credit criterion in the rubric:
- **Functional correctness (8 pts):** All required behaviors and boundary cases work[cite: 8].
- **Hook selection and usage (5 pts):** Hooks match their purpose, follow call order rules, and have complete dependency arrays[cite: 8].
- **Debugging evidence (3 pts):** All 17 required faults are repaired and accurately explained[cite: 2, 3, 4, 5, 6, 7, 8].
- **Code quality (2 pts):** Components, names, state shape, and logic are clear[cite: 8].
- **Demonstration and testing (2 pts):** Student can demonstrate required validation cases and explain one bug encountered and the code change that fixed it[cite: 1, 8].

### Required `README.md` Sections:
1. **How to Run:** `npm install` followed by `npm run dev`[cite: 1].
2. **Completed Requirements Checklist:** Covering Exams 1–6[cite: 1].
3. **Known Limitations:** Any scope notes[cite: 1].
4. **Test & Validation Steps:** Step-by-step instructions to verify every exam[cite: 1].
5. **When Memoization is Unnecessary (Exam 5):** Code example and technical explanation[cite: 6].
6. **Debugging Cases & Bug Explanations (Cases 1–17):** Full before/after code and explanations for the live demonstration[cite: 1, 2, 3, 4, 5, 6, 7, 8].
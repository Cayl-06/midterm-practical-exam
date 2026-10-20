export const INITIAL_ISSUE_STATE = {
  issues: [],
  filter: 'all',
  nextId: 1
};

export const issueReducer = (state = INITIAL_ISSUE_STATE, action) => {
  if (!action || typeof action.type !== 'string') {
    return state;
  }

  switch (action.type) {
    case 'ADD_ISSUE': {
      const rawTitle = action.payload?.title ?? '';
      const trimmedTitle = rawTitle.trim();
      if (!trimmedTitle) {
        return state;
      }

      const newIssue = {
        id: state.nextId,
        title: trimmedTitle,
        done: false
      };

      return {
        ...state,
        issues: [...state.issues, newIssue],
        nextId: state.nextId + 1
      };
    }

    case 'TOGGLE_ISSUE': {
      const targetId = action.payload?.id;
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.id === targetId ? { ...issue, done: !issue.done } : issue
        )
      };
    }

    case 'DELETE_ISSUE': {
      const targetId = action.payload?.id;
      return {
        ...state,
        issues: state.issues.filter((issue) => issue.id !== targetId)
      };
    }

    case 'SET_FILTER': {
      const nextFilter = action.payload?.filter;
      const validFilters = ['all', 'open', 'done'];
      if (!validFilters.includes(nextFilter)) {
        return state;
      }
      return {
        ...state,
        filter: nextFilter
      };
    }

    case 'CLEAR_DONE': {
      return {
        ...state,
        issues: state.issues.filter((issue) => !issue.done)
      };
    }

    default:
      return state;
  }
};

// Requirement 6: Three automated reducer unit tests using sample states and actions
export const runIssueReducerTests = () => {
  const results = [];

  // Test 1: ADD_ISSUE adds a new issue immutably and increments nextId
  const sampleState1 = {
    issues: [{ id: 1, title: 'Configure Vite project', done: false }],
    filter: 'all',
    nextId: 2
  };
  const nextState1 = issueReducer(sampleState1, {
    type: 'ADD_ISSUE',
    payload: { title: 'Write reducer unit tests' }
  });
  const test1Passed =
    nextState1 !== sampleState1 &&
    nextState1.issues !== sampleState1.issues &&
    sampleState1.issues.length === 1 &&
    nextState1.issues.length === 2 &&
    nextState1.issues[1].id === 2 &&
    nextState1.issues[1].title === 'Write reducer unit tests' &&
    nextState1.issues[1].done === false &&
    nextState1.nextId === 3;

  results.push({
    id: 'test-add-issue',
    name: 'Test 1: ADD_ISSUE (Immutability + nextId Increment)',
    passed: test1Passed,
    details: `Expected 2 issues with nextId=3 and untouched original array (length 1). Got ${nextState1.issues.length} issues, nextId=${nextState1.nextId}.`
  });

  // Test 2: TOGGLE_ISSUE flips target issue's done flag without mutating original issue object
  const originalIssue = { id: 10, title: 'Fix stale closure in timer', done: false };
  const sampleState2 = {
    issues: [originalIssue, { id: 11, title: 'Add context provider', done: false }],
    filter: 'all',
    nextId: 12
  };
  const nextState2 = issueReducer(sampleState2, {
    type: 'TOGGLE_ISSUE',
    payload: { id: 10 }
  });
  const toggledIssue = nextState2.issues.find((item) => item.id === 10);
  const untouchedSibling = nextState2.issues.find((item) => item.id === 11);
  const test2Passed =
    nextState2 !== sampleState2 &&
    toggledIssue !== originalIssue &&
    originalIssue.done === false &&
    toggledIssue?.done === true &&
    untouchedSibling === sampleState2.issues[1];

  results.push({
    id: 'test-toggle-issue',
    name: 'Test 2: TOGGLE_ISSUE (Flips done boolean & creates new issue reference)',
    passed: test2Passed,
    details: `Original issue.done remained ${String(originalIssue.done)}; new state issue.done is ${String(toggledIssue?.done)}.`
  });

  // Test 3: CLEAR_DONE removes all completed issues while preserving open issues
  const sampleState3 = {
    issues: [
      { id: 1, title: 'Open task A', done: false },
      { id: 2, title: 'Completed task B', done: true },
      { id: 3, title: 'Completed task C', done: true }
    ],
    filter: 'all',
    nextId: 4
  };
  const nextState3 = issueReducer(sampleState3, {
    type: 'CLEAR_DONE'
  });
  const test3Passed =
    nextState3 !== sampleState3 &&
    sampleState3.issues.length === 3 &&
    nextState3.issues.length === 1 &&
    nextState3.issues[0].id === 1 &&
    nextState3.issues[0].done === false;

  results.push({
    id: 'test-clear-done',
    name: 'Test 3: CLEAR_DONE (Removes completed issues & preserves open issues)',
    passed: test3Passed,
    details: `Filtered 3 sample issues down to ${nextState3.issues.length} open issue (ID #${nextState3.issues[0]?.id}).`
  });

  console.table(results);
  return results;
};


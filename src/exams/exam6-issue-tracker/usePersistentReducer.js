import { useReducer, useEffect } from 'react';

export const usePersistentReducer = (reducer, initialState, storageKey) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (defaultState) => {
      try {
        const rawSaved = window.localStorage.getItem(storageKey);
        if (!rawSaved) {
          return defaultState;
        }
        const parsed = JSON.parse(rawSaved);
        if (
          parsed &&
          typeof parsed === 'object' &&
          Array.isArray(parsed.issues) &&
          typeof parsed.filter === 'string' &&
          typeof parsed.nextId === 'number'
        ) {
          return parsed;
        }
        return defaultState;
      } catch (error) {
        console.warn(`[usePersistentReducer] Failed to read key "${storageKey}":`, error);
        return defaultState;
      }
    }
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn(`[usePersistentReducer] Failed to write key "${storageKey}":`, error);
    }
  }, [storageKey, state]);

  return [state, dispatch];
};


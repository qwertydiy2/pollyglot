import _ from 'lodash';

export interface PollyGlotState {
  [key: string]: any;
}

export function saveStateToLocalStorage(state: PollyGlotState) {
  localStorage.setItem('pollyglot_state', JSON.stringify(state));
}

export function loadStateFromLocalStorage(): PollyGlotState | null {
  const saved = localStorage.getItem('pollyglot_state');
  return saved ? JSON.parse(saved) : null;
}

export function saveStateToHistory(state: PollyGlotState) {
  const history = loadHistoryFromLocalStorage();
  history.push({
    timestamp: Date.now(),
    state: _.cloneDeep(state),
  });
  localStorage.setItem('pollyglot_history', JSON.stringify(history));
}

export function loadHistoryFromLocalStorage() {
  return JSON.parse(localStorage.getItem('pollyglot_history') || '[]');
}

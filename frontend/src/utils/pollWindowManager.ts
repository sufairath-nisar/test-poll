import type { Poll } from '../types';
import { openPollResultsWindow } from './openPollResultsWindow';

let pollWindow: Window | null = null;

export function openOrUpdatePollWindow(poll: Poll): Window | null {
  if (!pollWindow || pollWindow.closed) {
    pollWindow = openPollResultsWindow(poll);
  } else {
    pollWindow.postMessage({ type: 'UPDATE_POLL', poll }, '*');
  }

  return pollWindow;
}

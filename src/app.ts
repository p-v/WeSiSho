import getCssSelector from 'css-selector-generator';
import Handler from './url-handler';
import Logger from './logger';

interface KeyIndex {
    [key: string]: boolean;
}

const KEY_TIMEOUT = 1000; // 2 seconds

/*
 * Get leader key and timeout from chrome storage.
 * key Defaults to ','
 * timeout Defaults to '1000'
 */
let leaderKey = ',';
let leaderTimeout = KEY_TIMEOUT;
chrome.storage.local.get(['leader_key', 'key_timeout'], (res) => {
  leaderKey = res.leader_key || ',';
  leaderTimeout = res.key_timeout || KEY_TIMEOUT;
});


let leaderTimeoutId: number;
let sequenceTimeoutId: number;
let isListeningForKeyPresses = false;
let sequence: number[] = []; // The sequence of characters entered after pressing leader
const handled: KeyIndex = {};

/*
 * Send key event for 'i' to enable insert mode in vimium
 */
function vimiumPatch() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i' }));
  window.dispatchEvent(new KeyboardEvent('keypress', { key: 'i' }));
  window.dispatchEvent(new KeyboardEvent('keyup', { key: 'i' }));
}

window.addEventListener('keyup', (e) => {
  if (handled[e.key]) {
    e.preventDefault();
    e.stopImmediatePropagation();
    delete handled[e.key];
  }
});


window.addEventListener('keydown', (e) => {
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) return;

  if (!isListeningForKeyPresses && e.key === leaderKey) {
    handled[e.key] = true;
    e.preventDefault();
    e.stopImmediatePropagation();
    // TODO check if the user uses vimium
    vimiumPatch();

    // Now listening for sequence
    isListeningForKeyPresses = true;
    sequence = [];

    Logger.log('Leader timeout started for 1 secs');

    leaderTimeoutId = <any>setTimeout(() => {
      Logger.log('Leader timed out');
      isListeningForKeyPresses = false;
    }, leaderTimeout);
  } else if (isListeningForKeyPresses && e.keyCode !== null) {
    handled[e.key] = true;
    e.preventDefault();
    e.stopImmediatePropagation();
    Logger.log('Leader and sequence timeout cleared');
    clearTimeout(leaderTimeoutId);
    if (sequenceTimeoutId) {
      clearTimeout(sequenceTimeoutId);
    }
    sequence.push(e.keyCode);
    isListeningForKeyPresses = true;

    sequenceTimeoutId = <any>setTimeout(() => {
      Logger.log('Sequence timed out');
      isListeningForKeyPresses = false;
      const charSequence = sequence.map(code => String.fromCharCode(code).toLowerCase());
      const key = charSequence.join('');
      chrome.runtime.sendMessage({ key, shift: false });
    }, leaderTimeout);
  }
}, true);


chrome.runtime.onMessage.addListener(Handler.onUrlReceive);

document.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    const clickedEl = event.target as HTMLElement;
    chrome.storage.local.get(['recording', 'activeRecording'], (res) => {
      const isRecording = res && res.recording;
      if (isRecording) {
        const selector = getCssSelector(clickedEl);

        const activeRecording = (res && res.activeRecording) || [];
        chrome.storage.local.set({ activeRecording: [...activeRecording, selector] });
      }
    });
  }
}, true);

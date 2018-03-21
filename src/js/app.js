import CssSelectorGenerator from 'css-selector-generator';
import Handler from './url-handler';
import Logger from './logger';

/*
 * Get leader key from chrome storage.
 * Defaults to ','
 */
let leaderKey;
chrome.storage.local.get('leader_key', (res) => {
  leaderKey = res.leader_key || ',';
});


const LEADER_TIMEOUT = 5000; // 2 seconds
const SEQUENCE_TIMEOUT = 1000; // 1 second

let leaderTimeoutId;
let sequenceTimeoutId;
let isListeningForKeyPresses = false;
let sequence = []; // The sequence of characters entered after pressing leader
const handled = {};

const cssSelectorGenerator = new CssSelectorGenerator();

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
  if (document.activeElement.tagName === 'INPUT') return;

  if (!isListeningForKeyPresses && e.key === leaderKey) {
    handled[e.key] = true;
    e.preventDefault();
    e.stopImmediatePropagation();
    // TODO check if the user uses vimium
    vimiumPatch();

    // Now listening for sequence
    isListeningForKeyPresses = true;
    sequence = [];

    Logger.log('Leader timeout started for 2 secs');

    leaderTimeoutId = setTimeout(() => {
      Logger.log('Leader timed out');
      isListeningForKeyPresses = false;
    }, LEADER_TIMEOUT);
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

    sequenceTimeoutId = setTimeout(() => {
      Logger.log('Sequence timed out');
      isListeningForKeyPresses = false;
      const charSequence = sequence.map(code => String.fromCharCode(code).toLowerCase());
      const key = charSequence.join('');
      chrome.runtime.sendMessage({ key, shift: false });
    }, SEQUENCE_TIMEOUT);
  }
}, true);


chrome.runtime.onMessage.addListener(Handler.onUrlReceive);

document.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    const clickedEl = event.target;
    chrome.storage.local.get(['recording', 'activeRecording'], (res) => {
      const isRecording = res && res.recording;
      if (isRecording) {
        const selector = cssSelectorGenerator.getSelector(clickedEl);

        const activeRecording = (res && res.activeRecording) || [];
        chrome.storage.local.set({ activeRecording: [...activeRecording, selector] });
      }
    });
  }
}, true);

import Handler from './url-handler';
import Utils from './utils';
import Logger from './logger';

if (window === top) {
  let leaderTimeout;
  let sequenceTimeout;
  let listeningForKeyPresses = false;
  let sequence = []; // The sequence of characters entered after pressing leader
  
  //get leader key, if undefined set it to ',' i.e. (key code 44)
  let leaderKey;
  chrome.storage.local.get('leader_key',  (res) => {
    leaderKey = res.leader_key || 44;
  });

  // Add event listener
  window.addEventListener('keypress', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    if (!listeningForKeyPresses && e.keyCode == leaderKey) {
      // leader key pressed
      // start timeout
      listeningForKeyPresses = true;
      sequence = [];
      console.log('Leader timeout started for 2 secs');
      leaderTimeout = setTimeout(() => {
        console.log('Leader timed out');
        listeningForKeyPresses = false;
      }, 2000);
    } else if (listeningForKeyPresses && e.keyCode !== null) {
      console.log('Leader and sequence timeout cleared');
      clearTimeout(leaderTimeout);
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }
      sequence.push(e.keyCode);
      listeningForKeyPresses = true;
      sequenceTimeout = setTimeout(() => {
        console.log('Sequence timed out');
        listeningForKeyPresses = false;
        const charSequence = sequence.map(code => String.fromCharCode(code).toLowerCase());
        const key = charSequence.join('');
        chrome.runtime.sendMessage({ key, shift: false });
      }, 1000);
    }
  }, false);
}


chrome.runtime.onMessage.addListener(Handler.onUrlReceive);

/*document.addEventListener('mousedown', (event) => {
  if (event.button === 2) {
    const clickedEl = event.target;
    Logger.log(Utils.getPathTo(clickedEl));
  }
}, true);*/

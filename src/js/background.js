chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'execute') {
    const { sequenceIndex, sequence } = request;
    if (sequenceIndex !== -1 && sequenceIndex < sequence.length) {
      setTimeout(() => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'execute_command',
          sequenceIndex,
          sequence,
        });
      }, sequenceIndex === 0 ? 0 : 1000);
    }
  } else {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    }, (tabs) => {
      const url = tabs[0].url;
      chrome.tabs.sendMessage(tabs[0].id, {
        url,
        action: 'perform',
        key: request.key,
      });
    });
  }
});

// Reset `recording` flag on tag change
chrome.tabs.onActivated.addListener(() => {
  chrome.storage.local.set({
    recording: false,
    activeRecording: [],
  });
});

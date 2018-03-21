chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
});

// Reset `recording` flag on tag change
chrome.tabs.onActivated.addListener(() => {
  chrome.storage.local.set({
    recording: false,
    activeRecording: []
  });
});

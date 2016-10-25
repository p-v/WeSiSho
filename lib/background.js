chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const url = tabs[0].url;
    chrome.tabs.sendMessage(tabs[0].id, { url, key: request.key, shift: request.shift });
  });
});

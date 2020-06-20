chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.type === 'execute') {
        const { sequenceIndex, sequence } = request;
        if (sequenceIndex !== -1 && sequenceIndex < sequence.length) {
            setTimeout(() => {
                if (sender.tab && sender.tab.id) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        action: 'execute_command',
                        sequenceIndex,
                        sequence,
                    });
                }
            }, sequenceIndex === 0 ? 0 : 1000);
        }
    } else {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        }, (tabs) => {
            const url = tabs[0].url;
            if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    url,
                    action: 'perform',
                    key: request.key,
                });
            }
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

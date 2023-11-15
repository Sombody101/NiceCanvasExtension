// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Handle messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateMainPage') {
        // Send a message to the active tab's content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0]?.id;
            if (tabId) {
                chrome.tabs.sendMessage(tabId, { action: 'performUpdate' });
            }
        });
    }
});

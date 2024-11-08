// Keep track of overlay state for each tab
const overlayStates = new Map();

chrome.action.onClicked.addListener((tab) => {
    const hasOverlay = overlayStates.get(tab.id);
    
    if (hasOverlay) {
        // Remove styling
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                document.body.setAttribute('data-bionic-removing', 'true');
            }
        });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['scripts/content-extractor.js']
        });
        overlayStates.set(tab.id, false);
    } else {
        // Apply styling
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['scripts/content-extractor.js']
        });
        overlayStates.set(tab.id, true);
    }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    overlayStates.delete(tabId);
});
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        'extensionEnabled': true,
    });
  });
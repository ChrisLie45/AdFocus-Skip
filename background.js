chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        'adfocusSkipEnabled': true,
        'showSkip': true,
        'enableRedirect': true,
        'count': 0
    });
  });
function save_options() {
    var adfocusSkipEnabled = document.getElementById('adfocskip-enabled').checked;
    var showSkip = document.getElementById('show-skip').checked;
    var enableRedirect = document.getElementById('enable-redirect').checked;

    chrome.storage.sync.set({
        'adfocusSkipEnabled': adfocusSkipEnabled,
        'showSkip': showSkip,
        'enableRedirect': enableRedirect
    }, function() {
        console.log('saved');
    });
}

function restore_options() {
    chrome.storage.sync.get(['adfocusSkipEnabled', 'enableRedirect', 'showSkip'], function(items) {
      document.getElementById('adfocskip-enabled').checked = items.adfocusSkipEnabled;
      document.getElementById('show-skip').checked = items.showSkip;
      document.getElementById('enable-redirect').checked = items.enableRedirect;
    });
}

function restore_count() {
    chrome.storage.sync.get(['count'], function(items) {
      document.getElementById('count').textContent = items.count + " ads skipped";
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', restore_count);

document.querySelectorAll("input[name=checkbox]").forEach(function(checkbox) {
    checkbox.addEventListener('change', save_options);
    console.log(checkbox);
});
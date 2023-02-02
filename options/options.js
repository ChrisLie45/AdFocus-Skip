function saveOptions() {
    let extensionEnabled = document.getElementById('extension-enabled').checked;

    chrome.storage.sync.set({
        'extensionEnabled': extensionEnabled,
    }, function() {
        console.log('saved');
    });
}

function restoreOptions() {
    chrome.storage.sync.get(['extensionEnabled'], function(items) {
        document.getElementById('extension-enabled').checked = items.extensionEnabled;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.querySelectorAll("input[name=checkbox]").forEach(function(checkbox) {
    checkbox.addEventListener('change', saveOptions);
    console.log(checkbox);
});
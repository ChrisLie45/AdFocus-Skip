function saveOptions() {
    const extensionEnabled = document.getElementById('extension-enabled').checked;
    const hideLabel = document.getElementById('hide-label').checked;

    chrome.storage.sync.set({
        'extensionEnabled': extensionEnabled,
        'hideLabel': hideLabel
    }, function () {
        const text = document.getElementById('status-text');
        text.textContent = 'Options saved. Refresh page to see changes.';
    });
}

function restoreOptions() {
    chrome.storage.sync.get(['extensionEnabled', 'hideLabel'], function (items) {
        document.getElementById('extension-enabled').checked = items.extensionEnabled;
        document.getElementById('hide-label').checked = items.hideLabel;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.querySelectorAll("input[name=checkbox]").forEach(function (checkbox) {
    checkbox.addEventListener('change', saveOptions);
});
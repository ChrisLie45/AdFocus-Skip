function save_options() {
    let extensionEnabled = document.getElementById('extension-enabled').checked;

    chrome.storage.sync.set({
        'extensionEnabled': extensionEnabled,
    }, function() {
        console.log('saved');
    });
}

function restore_options() {
    chrome.storage.sync.get(['extensionEnabled'], function(items) {
        document.getElementById('extension-enabled').checked = items.extensionEnabled;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);

document.querySelectorAll("input[name=checkbox]").forEach(function(checkbox) {
    checkbox.addEventListener('change', save_options);
    console.log(checkbox);
});
function save_options() {
    let extensionEnabled = document.getElementById('extension-enabled').checked;
    let showSkip = document.getElementById('show-skip').checked;
    let redirectEnabled = document.getElementById('redirect-enabled').checked;

    chrome.storage.sync.set({
        'extensionEnabled': extensionEnabled,
        'showSkip': showSkip,
        'redirectEnabled': redirectEnabled
    }, function() {
        console.log('saved');
    });
}

function restore_options() {
    chrome.storage.sync.get(['extensionEnabled', 'redirectEnabled', 'showSkip'], function(items) {
        document.getElementById('extension-enabled').checked = items.extensionEnabled;
        document.getElementById('show-skip').checked = items.showSkip;
        document.getElementById('redirect-enabled').checked = items.redirectEnabled;
    });
}

function restore_count() {
    chrome.storage.sync.get(['count'], function(items) {
        let countStr = items.count + (items.count == 1 ? " ad skipped" : " ads skipped");
        document.getElementById('count').textContent = countStr;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', restore_count);

document.querySelectorAll("input[name=checkbox]").forEach(function(checkbox) {
    checkbox.addEventListener('change', save_options);
    console.log(checkbox);
});
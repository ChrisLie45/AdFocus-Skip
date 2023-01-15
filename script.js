async function get_options() {
  return await new Promise(function(resolve) {
    chrome.storage.sync.get(['extensionEnabled', 'redirectEnabled', 'showSkip'], function(items) {
      resolve(items);
    });
  });
}

function update_count() {
    chrome.storage.sync.get(['count'], function(items) {
      chrome.storage.sync.set({'count': items.count + 1});
    });
} 
  
async function skip_ad(){
  const options = await get_options();
  
  if (options.extensionEnabled == false){
    return;
  }

  if (options.redirectEnabled){
    let redirectURL = document.querySelector(".skip").getAttribute("href");
    window.location.href = redirectURL;
  }
  else {
    if (options.showSkip){
      let showTimer = document.getElementById("showTimer")
      showTimer.style.display = "none"
      
      let showSkip = document.getElementById("showSkip")
      showSkip.style.display = ""
    }
  }

  update_count();
}

skip_ad();

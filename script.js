async function get_options() {
  return await new Promise(function(resolve, reject) {
    chrome.storage.sync.get(['adfocusSkipEnabled', 'enableRedirect', 'showSkip'], function(items) {
      resolve(items);
    });
  });
}

function count() {
    chrome.storage.sync.get(['count'], function(items) {
      chrome.storage.sync.set({'count': items.count + 1});
    });
} 
  
async function skip_ad(){
  const options = await get_options();
  
  if (options.adfocusSkipEnabled){
    if (options.enableRedirect){
      const redirectURL = document.querySelector(".skip").getAttribute("href");
      window.location.href = redirectURL;
    }
    else {
      if (options.showSkip){
        const showTimer = document.getElementById("showTimer")
        showTimer.style.display = "none"
        
        const showSkip = document.getElementById("showSkip")
        showSkip.style.display = ""
      }
    }
    count();
  }
}
  
skip_ad();

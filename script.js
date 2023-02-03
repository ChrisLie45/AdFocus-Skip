const MAIN_CONTAINER_CLASS = 'hciOr5UGrnYrZxB11tX9s';
const POST_CONTAINER_CLASS = 'rpBJOHq2PR60pnwJlUyP0';
const PREVIEW_IMAGE_LABEL_CLASS = '_3hUbl08LBz2mbXjy0iYhOS';
const MULTI_PREVIEW_IMAGE_LABEL_CLASS = '_3b8u2OJXaSDdBWoRB7zUoK';
const MIN_POSTS = 14; // 14 is an arbitrary number for minimum number of loaded posts

async function getOptions() {
  return await new Promise(function(resolve) {
    chrome.storage.sync.get(['extensionEnabled', 'hideLabel'], function(items) {
      resolve(items);
    });
  });
}

function setImageHeight(element, querySelector, height) {
  const parent = element.parentElement;
  const image = parent.querySelector(querySelector);

  if (image) {
    image.style.height = height;
  }
}

function shrinkPostImage(element) {
  const previewImageLabel = element.querySelector(`.${PREVIEW_IMAGE_LABEL_CLASS}`);
  const multiPreviewImageLabel = element.querySelectorAll(`.${MULTI_PREVIEW_IMAGE_LABEL_CLASS}`);
  const height = "512px" // Default height of post container
  
  if (previewImageLabel) {
    setImageHeight(previewImageLabel, 'img[alt="Post image"]', height);
  } 

  if (multiPreviewImageLabel) {
    // Wait for images to load before setting height
    multiPreviewImageLabel.forEach((element) => {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type == "childList") {
            setImageHeight(element, '._1dwExqTGJH2jnA-MYGkEL-', height);
            observer.disconnect();
          }
        });
      });

      const targetNode = element.parentElement;
      observer.observe(targetNode, { childList: true});
    });
  }
}

function hidePostLabel(element) {
  const previewImageLabel = element.querySelector(`.${PREVIEW_IMAGE_LABEL_CLASS}`);
  const multiPreviewImageLabel = element.querySelectorAll(`.${MULTI_PREVIEW_IMAGE_LABEL_CLASS}`);

  if (previewImageLabel) {
    previewImageLabel.style.display = "none";
  } 

  if (multiPreviewImageLabel) {
    multiPreviewImageLabel.forEach((element) => {
      element.style.display = "none";
    });
  }
}

async function main() {
  const options = await getOptions();

  if (!options.extensionEnabled) return;
  
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type != "childList") return;

      const addedNode = mutation.addedNodes[0];

      if (!addedNode) return; 

      const parent = addedNode.parentElement;

      if (!parent) return;

      if (!parent.classList.contains(POST_CONTAINER_CLASS)) return; 

      if (parent.childNodes.length < MIN_POSTS) {
        // Apply settings to all pre loaded posts
        parent.childNodes.forEach((element) => {
          shrinkPostImage(element);

          if (options.hideLabel) {
            hidePostLabel(element)
          }

        });
      } else { 
        shrinkPostImage(addedNode);

        if (options.hideLabel) {
          hidePostLabel(addedNode)
        }

      }
    });
  });

  const targetNode = document.querySelector(`.${MAIN_CONTAINER_CLASS}`);
  observer.observe(targetNode, { childList: true, subtree: true});
}

main();
const MAIN_CONTAINER_CLASS = 'hciOr5UGrnYrZxB11tX9s';
const POST_CONTAINER_CLASS = 'rpBJOHq2PR60pnwJlUyP0';
const PREVIEW_IMAGE_CLASS = '_3hUbl08LBz2mbXjy0iYhOS';
const MULT_PREVIEW_IMAGE_CLASS = '_3b8u2OJXaSDdBWoRB7zUoK';

async function getOptions() {
  return await new Promise(function(resolve) {
    chrome.storage.sync.get(['extensionEnabled'], function(items) {
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
  const previewImage = element.querySelector(`.${PREVIEW_IMAGE_CLASS}`);
  const multiPreviewImage = element.querySelectorAll(`.${MULT_PREVIEW_IMAGE_CLASS}`);
  const height = "512px" // Default height of post container
  
  if (previewImage) {
    setImageHeight(previewImage, 'img[alt="Post image"]', height);
  } 

  if (multiPreviewImage) {
    // Wait for images to load before setting height
    multiPreviewImage.forEach((element) => {
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

      if (parent.classList.contains(POST_CONTAINER_CLASS)) {
        // Shrink existing images on page load
        // 14 is an arbitrary number for minimum number of loaded posts
        if (parent.childNodes.length < 14) {
          parent.childNodes.forEach((element) => {
            shrinkPostImage(element);
          });
        } else {
          shrinkPostImage(addedNode);
        }
      }
    });
  });

  const targetNode = document.querySelector(`.${MAIN_CONTAINER_CLASS}`);
  observer.observe(targetNode, { childList: true, subtree: true});
}

main();
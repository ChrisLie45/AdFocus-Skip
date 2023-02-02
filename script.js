const MAIN_CONTENT_CLASS = 'rpBJOHq2PR60pnwJlUyP0';
const PREVIEW_IMAGE_CLASS = '_3hUbl08LBz2mbXjy0iYhOS';
const MULT_PREVIEW_IMAGE_CLASS = '_3b8u2OJXaSDdBWoRB7zUoK';

async function get_options() {
  return await new Promise(function(resolve) {
    chrome.storage.sync.get(['extensionEnabled'], function(items) {
      resolve(items);
    });
  });
}

function set_image_height(element, querySelector, height) {
  const parent = element.parentElement;
  const image = parent.querySelector(querySelector);

  if (image) {
    image.style.height = height;
  }
}

function shrink_preview_image(element) {
  const previewImage = element.querySelector(`.${PREVIEW_IMAGE_CLASS}`);
  const multiPreviewImage = element.querySelectorAll(`.${MULT_PREVIEW_IMAGE_CLASS}`);
  const height = "512px" // Default height of post container
  
  if (previewImage) {
    set_image_height(previewImage, 'img[alt="Post image"]', height);
  } 

  if (multiPreviewImage) {
    // Wait for images to load before setting height
    multiPreviewImage.forEach((element) => {
      const observer1 = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type == "childList") {
            set_image_height(element, '._1dwExqTGJH2jnA-MYGkEL-', height);
            observer1.disconnect();
          }
        });
      });

      const targetNode1 = element.parentElement;
      observer1.observe(targetNode1, { childList: true});
    });
  }
}

async function main() {
  const options = await get_options();

  if (!options.extensionEnabled) return;
  
  const mainContentContainer = document.querySelector(`.${MAIN_CONTENT_CLASS}`);
  const childNodes = mainContentContainer.childNodes;

  // Shrink existing images on page load
  childNodes.forEach((element) => {
    console.log('test')
    shrink_preview_image(element);
  });

  // Shrink new images as they are added
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type == "childList") {
        const addedNode = mutation.addedNodes[0];
        shrink_preview_image(addedNode);
      }
    });
  });

  const targetNode = mainContentContainer;
  if (targetNode) observer.observe(targetNode, { childList: true});
}

main();
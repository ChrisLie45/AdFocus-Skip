const MAIN_CONTAINER_CLASS = 'hciOr5UGrnYrZxB11tX9s';
const POST_CONTAINER_CLASS = 'rpBJOHq2PR60pnwJlUyP0';
const PREVIEW_IMAGE_LABEL_CLASS = '_3hUbl08LBz2mbXjy0iYhOS';
const MULTI_PREVIEW_IMAGE_LABEL_CLASS = '_3b8u2OJXaSDdBWoRB7zUoK';
const IMAGE_CONTAINER_CLASS = '_3Oa0THmZ3f5iZXAQ0hBJ0k'
const IMAGE_CONTAINER_CONTAINER_CLASS = 'STit0dLageRsa2yR4te_b'; //i give up

async function getOptions() {
  return await new Promise(function (resolve) {
    chrome.storage.sync.get(['extensionEnabled', 'hideLabel'], function (items) {
      resolve(items);
    });
  });
}

function setImageHeight(element, querySelector, height) {
  const parent = element.parentElement;
  const image = parent.querySelector(querySelector);

  if (image) {
    image.style.height = height;
    return true;
  } else {
    return false;
  }
}

function shrinkPostImage(element) {
  const previewImageLabel = element.querySelector(`.${PREVIEW_IMAGE_LABEL_CLASS}`);
  const multiPreviewImageLabel = element.querySelectorAll(`.${MULTI_PREVIEW_IMAGE_LABEL_CLASS}`);
  const height = "512px" // Default height of post container

  if (previewImageLabel) {
    addExpandButton(element);
    setImageHeight(previewImageLabel, 'img[alt="Post image"]', height);
  }

  if (multiPreviewImageLabel.length > 0) {
    addExpandButton(element);

    multiPreviewImageLabel.forEach((element) => {
      if (!setImageHeight(element, '._1dwExqTGJH2jnA-MYGkEL-', height)) {

        // Wait for image to load before setting height
        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.type == "childList") {
              setImageHeight(element, '._1dwExqTGJH2jnA-MYGkEL-', height);
              observer.disconnect();
            }
          });
        });

        const targetNode = element.parentElement;
        observer.observe(targetNode, { childList: true });
      }
    });
  }
}

function expandPostImage(element) {
  const previewImageLabel = element.querySelector(`.${PREVIEW_IMAGE_LABEL_CLASS}`);
  const multiPreviewImageLabel = element.querySelectorAll(`.${MULTI_PREVIEW_IMAGE_LABEL_CLASS}`);

  if (previewImageLabel) {
    const image = element.querySelector('img[alt="Post image"]');
    const imageContainer = element.querySelector(`.${IMAGE_CONTAINER_CLASS}`);
    const imageContainerContainer = element.querySelector(`.${IMAGE_CONTAINER_CONTAINER_CLASS}`);

    image.style.height = null;
    imageContainer.style.maxHeight = null;

    const height = image.height + "px";

    imageContainerContainer.style.height = height;
  }

  if (multiPreviewImageLabel.length > 0) {

    let height = 0;
    multiPreviewImageLabel.forEach((label) => {
      const parent = label.parentElement;
      const image = parent.querySelector('._1dwExqTGJH2jnA-MYGkEL-');
      
      image.style.height = null;

      // Get height of largest image to set height of container
      if (image.naturalHeight > height) {
        height = image.height;
      }
    });

    height = height + 35 + "px";

    const container1 = element.querySelector('.STit0dLageRsa2yR4te_b');
    const container2 = element.querySelector('.m3aNC6yp8RrNM_-a0rrfa');
    const container3 = element.querySelector('._3gBRFDB5C34UWyxEe_U6mD');
    const container4 = element.querySelector('.KVyBaj7FjzElWsqJDmw7v');

    container1.style.height = height;
    container2.style.maxHeight = height;
    container3.style.paddingBottom = height;
    container4.style.height = height;

    // Lazy fix for post with captions
    const caption = element.querySelectorAll('._15nNdGlBIgryHV04IfAfpA');
    if (caption) {
      container4.style.height = container4.offsetHeight-35 + "px";
    }
  }
}

function addExpandButton(element) {
  const buttonContainer = element.querySelector(`._3-miAEojrCvx_4FQ8x3P-s`);

  const buttonDiv = document.createElement('div');
  const button = document.createElement('button');
  const buttonSpan = document.createElement('span');
  const buttonIcon = document.createElement('i');
  
  buttonSpan.textContent = "Expand";
  button.classList.add('YszYBnnIoNY8pZ6UwCivd');
  buttonDiv.classList.add('_3U_7i38RDPV5eBv7m4M-9J');
  buttonIcon.classList.add('icon', 'icon-expand');
  buttonIcon.style.paddingRight = "5px";
  button.addEventListener("click", function () {
    expandPostImage(element);
  });

  button.appendChild(buttonIcon);
  button.appendChild(buttonSpan);
  buttonDiv.appendChild(button);
  buttonContainer.appendChild(buttonDiv);
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

  if (!options.extensionEnabled) {
    return;
  }

  let newPageLoaded = true;
  let postCount = 0;
  
  const observer = new MutationObserver(handleMutation);
  const targetNode = document.querySelector(`.${MAIN_CONTAINER_CLASS}`);
  observer.observe(targetNode, { childList: true, subtree: true });


  function handleMutation(mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type != "childList") {
        return;
      }

      const addedNode = mutation.addedNodes[0];

      if (!addedNode) {
        return;
      }

      const parent = addedNode.parentElement;

      if (!parent) {
        return;
      }

      if (!parent.classList.contains(POST_CONTAINER_CLASS)) {
        return;
      }

      if (parent.childNodes.length < postCount) {
        newPageLoaded = true;
      }

      postCount = parent.childNodes.length;

      if (newPageLoaded) {
        // Apply settings to all pre loaded posts
        handleExistingNodes(parent);
      } else {
        handleAddedNode(addedNode)
      }
    });
  }

  function handleExistingNodes(postContainer) {
    postContainer.childNodes.forEach((element) => {
      shrinkPostImage(element);

      if (options.hideLabel) {
        hidePostLabel(element)
      }
    });
    newPageLoaded = false;
  }

  function handleAddedNode(node) {
    shrinkPostImage(node);

    if (options.hideLabel) {
      hidePostLabel(node)
    }
  }
}

main();
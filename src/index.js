let currentIndex = null;
let timeout;
let settings = {
  scrollAnimationsEnabled: true,
  vimMotionsEnabled: false,
};

const parentComments = Array.from(
  document.querySelectorAll('.comment-tree tr.athing.comtr td.ind[indent="0"]'),
).map((td) => td.closest("tr.athing.comtr"));

function closestElementBelowViewport(elements) {
  const viewportTop = window.scrollY;
  let minDistance = Infinity;
  let closestIndex = -1;

  for (let i = 0; i < elements.length; i++) {
    const rect = elements[i].getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;

    if (elementTop > viewportTop && elementTop - viewportTop < minDistance) {
      minDistance = elementTop - viewportTop;
      closestIndex = i;
    }
  }

  return closestIndex;
}

function updateCurrentIndex() {
  const closestIndex = closestElementBelowViewport(parentComments);
  currentIndex = Math.max(0, closestIndex - 1);
}

function onScrollEnd(callback, refresh = 66) {
  if (!callback || typeof callback !== "function") return;

  let timeout;

  window.addEventListener(
    "wheel",
    function () {
      window.clearTimeout(timeout);
      timeout = setTimeout(callback, refresh);
    },
    false,
  );
}

function handleVerticalMotion() {
  window.clearTimeout(timeout);
  timeout = setTimeout(updateCurrentIndex, 66);
}

function handleVimMotions(event) {
  if (!settings.vimMotionsEnabled) return;

  let vimMotionEvent = null;

  // Vim Motions
  switch (event.key) {
    case "j":
      window.scrollBy(0, 100);
      handleVerticalMotion();
      return;
    case "k":
      window.scrollBy(0, -100);
      handleVerticalMotion();
      return;
    case "h":
      vimMotionEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
      break;
    case "l":
      vimMotionEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
      break;
    default:
      break;
  }

  if (vimMotionEvent != null) {
    document.dispatchEvent(vimMotionEvent);
    return;
  }
}

document.addEventListener("keydown", (e) => {
  if (
    document.activeElement.nodeName === "INPUT" ||
    document.activeElement.nodeName === "TEXTAREA"
  ) {
    return;
  }

  handleVimMotions(e);

  if (e.key === "ArrowUp" || e.key == "ArrowDown") {
    handleVerticalMotion();
  }

  if (e.key === "ArrowLeft") {
    if (currentIndex == null) return;
    currentIndex = Math.max(0, currentIndex - 1);
  } else if (e.key === "ArrowRight") {
    if (currentIndex == null) currentIndex = 0;
    else currentIndex = Math.min(parentComments.length - 1, currentIndex + 1);
  } else {
    return;
  }

  parentComments[currentIndex].scrollIntoView({
    behavior: settings.scrollAnimationsEnabled ? "smooth" : "auto",
  });
});

onScrollEnd(updateCurrentIndex);

async function getSettings() {
  const storage = await browser.storage.sync.get();
  settings = {
    ...settings,
    ...storage,
  };
}

getSettings();

browser.storage.sync.onChanged.addListener((changes) => {
  const changedItems = Object.keys(changes);

  if (changes.vimMotionsEnabled) {
    settings.vimMotionsEnabled = changes.vimMotionsEnabled.newValue;
  }
  if (changes.scrollAnimationsEnabled) {
    settings.scrollAnimationsEnabled = changes.scrollAnimationsEnabled.newValue;
  }
});

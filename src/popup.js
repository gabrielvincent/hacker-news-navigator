function handleToggleVimMotionsCheckbox(event) {
  browser.storage.sync.set({ vimMotionsEnabled: event.target.checked });
}

function handleToggleScrollAnimationsCheckbox(event) {
  browser.storage.sync.set({ scrollAnimationsEnabled: event.target.checked });
}

function handleClickLabel(event) {
  const checkboxElement = document.querySelector(
    `input[name="${event.target.htmlFor}"]`,
  );
  checkboxElement.checked = !checkboxElement.checked;
  checkboxElement.dispatchEvent(new Event("change"));
  console.log(`--- checkbox: `, checkboxElement);
}

async function init() {
  const settings = await browser.storage.sync.get();

  const vimMotionsCheckbox = document.querySelector(
    'input[name="vim-motions-enabled"]',
  );
  const vimMotionsLabel = document.querySelector(
    'label[for="vim-motions-enabled"]',
  );
  vimMotionsCheckbox?.addEventListener(
    "change",
    handleToggleVimMotionsCheckbox,
  );
  vimMotionsLabel?.addEventListener("click", handleClickLabel);

  const scrollAnimationsCheckbox = document.querySelector(
    'input[name="scroll-animations-enabled"]',
  );
  const scrollAnimationsLabel = document.querySelector(
    'label[for="scroll-animations-enabled"]',
  );
  scrollAnimationsCheckbox?.addEventListener(
    "change",
    handleToggleScrollAnimationsCheckbox,
  );
  scrollAnimationsLabel?.addEventListener("click", handleClickLabel);

  if (vimMotionsCheckbox) {
    vimMotionsCheckbox.checked = settings.vimMotionsEnabled ?? false;
  }

  if (scrollAnimationsCheckbox) {
    scrollAnimationsCheckbox.checked = settings.scrollAnimationsEnabled ?? true;
  }
}

init();

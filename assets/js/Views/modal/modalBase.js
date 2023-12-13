export const destroyModal = () => {
  document.querySelector(".modal__i").remove();
  document.querySelector(".overlay__i").remove();
};

export const insertModal = (markup) => {
  document.querySelector("body").insertAdjacentHTML("beforeend", markup);
};

export const addClosingEventListeners = (elements = []) => {
  [...elements, ".modal-close__i", ".overlay__i"].forEach((el) => {
    if (!el) return;
    document.querySelector(el).addEventListener("click", destroyModal);
  });
};

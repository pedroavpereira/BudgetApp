const modalContent = document.querySelector(".modalContent");

//Code used to update Base Modal
export const updateBaseModal = (options) => {
  changeTitle(options.title);
  updateSubmitButton(options.submitBtn);
  updateDeleteButton(options.deleteBtn);
};

const changeTitle = (message = "Add / update") => {
  document.querySelector(".modal-title").textContent = message;
};

const updateSubmitButton = (optionsArr = ["Submit", "Close"]) => {
  const [message, type] = [...optionsArr];
  const submitBtn = document.querySelector(".btn--submitModal");
  submitBtn.textContent = message;
  submitBtn.setAttribute("data-type", type);
};

const updateDeleteButton = (optionsArr = ["", false]) => {
  const [message, display] = [...optionsArr];
  const btnDelete = document.querySelector(".btn--deleteTransaction");

  btnDelete.textContent = message;

  if (display) {
    btnDelete.classList.remove("d-none");
  } else {
    btnDelete.classList.add("d-none");
  }
};

//HTML inserting
const clearContent = () => {
  modalContent.innerHTML = "";
};

export const insertHTML = (markup) => {
  clearContent();
  modalContent.insertAdjacentHTML("afterbegin", markup);
};

//Event Listner for type picker

export const typePickerEvent = (stateObj, mov, handler) => {
  document
    .querySelector(".check-type")
    ?.addEventListener("click", function (e) {
      updateCategories(e, stateObj, mov, handler);
    });
};

const updateCategories = (e, stateObj, mov, handler) => {
  const target = e.target;
  const categoriesContainer = document.querySelector(
    ".modal-transaction--categories"
  );
  const categoryType = target.dataset.target;
  if (categoryType) {
    categoriesContainer.innerHTML = "";
    categoriesContainer.insertAdjacentHTML(
      "afterbegin",
      handler(stateObj, categoryType)
    );
  }
};

const modalContent = document.querySelector(".modalContent");

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

const clearContent = () => {
  modalContent.innerHTML = "";
};

export const insertHTML = (markup) => {
  clearContent();
  modalContent.insertAdjacentHTML("afterbegin", markup);
};

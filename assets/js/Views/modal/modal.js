export const changeTitle = (message) => {
  document.querySelector(".modal-title").textContent = message;
};

export const updateSubmitButton = (message) => {
  document.querySelector(".btn--submitModal").textContent = message;
};

export const updateDeleteButton = (message, show = false) => {
  const btnDelete = document.querySelector(".btn--deleteTransaction");

  btnDelete.textContent = message;

  if (show) {
    btnDelete.classList.remove("d-none");
  } else {
    btnDelete.classList.add("d-none");
  }
};

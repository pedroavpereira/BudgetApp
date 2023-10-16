import * as bootstrap from "bootstrap";

/*
Bootstrap elements
*/

const modalParentElement = document.querySelector("#addTransactionModal");
export const transactionModal = new bootstrap.Modal(modalParentElement);

document.querySelector(".btn-close").addEventListener("click", function () {
  transactionModal.hide();
});

//Code to remove every unnecessary class when the modal is closed
modalParentElement.addEventListener("hidden.bs.modal", function () {
  document.querySelector(".modal-error").classList.add("d-none");
  if (document.querySelector(".mov--active")) {
    document.querySelector(".mov--active").classList.remove("mov--active");
  }
});

/*
End of Bootstrap 
*/

const modalContent = document.querySelector(".modalContent");

//Code used to update Base Modal
export const updateBaseModal = (options) => {
  changeTitle(options.title);
  updateSubmitButton(options.submitBtn);
  updateDeleteButton(options.deleteBtn);
};

const changeTitle = (message) => {
  if (!message) return;
  document.querySelector(".modal-title").textContent = message;
};

const updateSubmitButton = (optionsArr = ["Submit", "Close"]) => {
  const [message, target] = [...optionsArr];
  const submitBtn = document.querySelector(".btn--submitModal");
  submitBtn.textContent = message;
  submitBtn.setAttribute("value", target);
  submitBtn.setAttribute("data-target", target);
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
      updateCategories(e, stateObj, handler);
    });
};

const updateCategories = (e, stateObj, handler) => {
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

export const deleteBtnEvent = (handler) => {
  const btnDeleteTrans = document.querySelector(".btn--deleteTransaction");

  btnDeleteTrans.addEventListener("click", function () {
    const id = document.querySelector(".mov--active").dataset.id;
    handler(id);
    transactionModal.hide();
  });
};

export const submitFormEvent = (handler) => {
  document.querySelector(".form").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    formData.append(
      "target",
      document.querySelector(".btn--submitModal").value
    );
    const dataArr = [...formData];
    const data = Object.fromEntries(dataArr);

    //Convert text to numbers
    if (data.amount) data.amount = Number(data.amount);
    if (data.goal) data.goal = Number(data.goal);

    if (data.day && data.month && data.year) {
      data.date = Date.parse(
        new Date(`${data.day} ${data.month} ${data.year}`)
      );
      delete data.day;
      delete data.moth;
      delete data.year;
    }

    if (document.querySelector(".mov--active")) {
      data.id = document.querySelector(".mov--active").dataset.id;
    }

    handler(data);
    transactionModal.hide();
  });
};

// export const submitButtonEvent = (
//   newTransactionHandler,
//   updateTransactionHandler,
//   updateAccountHandler,
//   updateBudgetHandler
// ) => {
//   document
//     .querySelector(".btn--submitModal")
//     .addEventListener("click", function (e) {
//       const type = this.dataset.target;
//       const data = makeshiftFormData();
//       switch (type) {
//         case "newTrans":
//           console.log("New trans");
//           newTransactionHandler;
//           break;
//         case "updateTrans":
//           console.log("update Trans");
//           updateTransactionHandler;
//           break;
//         case "updateAccount":
//           console.log("Update Account");
//           updateAccountHandler;
//           break;
//         case "updateBudget":
//           console.log("update Budget");
//           updateBudgetHandler;
//           break;
//         default:
//           console.log("close modal");
//           break;
//       }
//     });
// };

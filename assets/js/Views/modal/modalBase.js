import * as bootstrapElements from "./../../bootstrapElements.js";

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

    console.log(data);
    if (document.querySelector(".mov--active")) {
      data.id = document.querySelector(".mov--active").dataset.id;
    }

    handler(data);
    bootstrapElements.transactionModal.hide();
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

"use strict";

import * as helper from "./../bootstrapElements.js";
import * as config from "./../config.js";

const parentElement = document.querySelector("#addTransactionModal");

const generateBudgetMarkup = (stateArr) => {
  return `<div class="col">
    ${stateArr.budget
      .map((el) => {
        return `
    <div class="col my-2">
    <label for="cat${el.name}">${el.name}: </label>
    <input class="input--budget" data-category=${el.name} data-native="${el.native}" data-value="${el.value}" type="number" id="cat${el.name}" value="${el.target}" />
  </div>
    </div>`;
      })
      .join(" ")}`;
};

const generateBudgetCheckboxes = (arr, mov, type = "Expense") => {
  if (type === "Transfer") {
    return `
    <label class="form-check-label" for="selectAccountFrom">From: </label>
    <select
    name="month"
    class="form-select form-select-sm"
    id="selectAccountFrom" disabled 
  >
  <option value="${arr.currentAccount.name}" >${
      arr.currentAccount.name
    }</option>
  </select>
  <label class="form-check-label" for="selectTransferTo">To </label>
  <select
                          name="month"
                          class="form-select form-select-sm"
                          id="selectAccountTo"
                        >
                        ${arr.accounts
                          .map((el) => {
                            return `<option value="${el.name}" ${
                              el != arr.currentAccount ? "selected" : ""
                            }>${el.name}</option>`;
                          })
                          .join(" ")}
                        </select>
    `;
  } else {
    return `${arr.budget
      .filter((el) => el.type === type)
      .map((el, i) => {
        return `<div class="form-check">
      <input
    class="form-check-input radioTransModal"
    type="radio"
    name="radioCategory"
    id="cat${el.name}"
    ${mov?.category === el.name || i === 0 ? "checked" : ""}
    data-category="${el.name}"
  />
  <label class="form-check-label" for="cat${el.name}">
  ${el.name}
  </label>
  </div>`;
      })
      .join(" ")}`;
  }
};

const generateTransactionMarkup = (budgetObj, mov) => {
  const categoryPicker = mov?.type || "Expense";

  return `<div class="col">
  <div class="row check-type">
  <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expense-Type--Expense" data-target="Expense" checked>
      <label class="form-check-label" for="expense-Type--Expense">
        Expense
      </label>
      </div>
      <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expenseTypeIncome" data-target="Income" ${
        mov?.type === "Income" ? "checked" : ""
      }>
      <label class="form-check-label" for="expense-Type--Transfer">
        Income
      </label>
    </div>
    <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expenseTypeIncome" data-target="Transfer" ${
        mov?.type === "Transfer" ? "checked" : ""
      }>
      <label class="form-check-label" for="expense-Type--Income">
        Transfer
      </label>
    </div>
    </div>

    <div class="col my-2">
      <label class"col-2" for="newTransactionAmount">Date: </label>
      <input type="number" class=" col-2 datePickerModal"  id="getDayModal" value="${
        mov?.date ? new Date(mov.date).getDate() : new Date().getDate()
      }" />
      <select class="datePickerModal col-2" id="getMonthModal">
        ${config.months
          .map((el, i) => {
            return `<option value="${el}" ${
              mov?.date
                ? new Date(mov.date).getMonth() === i
                  ? "selected"
                  : ""
                : new Date().getMonth() === i
                ? "selected"
                : ""
            }>${el}</option>`;
          })
          .join("")}
      </select>

      <input type="number"  class="datePickerModal col-2" id="getYearModal" value="${
        mov?.date ? new Date(mov.date).getFullYear() : new Date().getFullYear()
      }" />
      </div>
      
      <div class="col my-2 modal-transaction--categories">
    ${generateBudgetCheckboxes(budgetObj, mov, categoryPicker)}
    </div>
      
  <div class="col my-2">
    <label for="newTransactionAmount">Amount: </label>
    <input type="number"  id="newTransactionAmount" value="${
      mov?.amount ? mov.amount : 0
    }" />
  
  </div>
  </div>
    `;
};

const generateSavingsMarkup = (accObj) => {
  return `<div>
  <div class="form-floating mb-3">
    <input
      type="name"
      class="form-control"
      id="foatingAccountName"
      placeholder="${accObj.name}"
      value = "${accObj.name}"
    />
    <label for="foatingAccountName">AccountName</label>
  </div>
  <div class="form-floating">
  <select class="form-select" id="floatingSelect" aria-label="Floating label select example" disabled>
  <option value="1" selected>${accObj.type}</option>
  </select>
  <label for="floatingSelect">Account Type</label>
  </div>
  <div class="form-floating mt-3">
    <input
      type="Number"
      class="form-control"
      id="FloatingAccountGoal"
      placeholder="${accObj.goal}"
      value = "${accObj.goal}"
    />
    <label for="FloatingAccountGoal">Account Goal</label>
  </div>
</div>`;
};

const updateCategories = (e, budgetObj, mov) => {
  const target = e.target;
  const categoriesContainer = document.querySelector(
    ".modal-transaction--categories"
  );
  const categoryType = target.dataset.target;
  if (categoryType) {
    categoriesContainer.innerHTML = "";
    categoriesContainer.insertAdjacentHTML(
      "afterbegin",
      generateBudgetCheckboxes(budgetObj, mov, categoryType)
    );
  }
};

export const updateModalInfo = (type, stateObj, mov) => {
  const buttonSubmit = document.querySelector(".btn--submitModal");
  buttonSubmit.setAttribute("data-type", type);

  let markup;

  if (type === "budget") {
    markup = generateBudgetMarkup(stateObj);
  } else {
    if (stateObj.currentAccount.type === "Savings") {
      buttonSubmit.setAttribute("data-type", "Savings");
      markup = generateSavingsMarkup(stateObj.currentAccount);
    } else {
      markup = generateTransactionMarkup(stateObj, mov);
    }
  }

  document.querySelector(".modalContent").innerHTML = "";

  document
    .querySelector(".modalContent")
    .insertAdjacentHTML("afterbegin", markup);

  document
    .querySelector(".check-type")
    ?.addEventListener("click", function (e) {
      updateCategories(e, stateObj, mov);
    });

  if (type === "transactionNew" || type === "budget") {
    document.querySelector(".btn--deleteTransaction").classList.add("d-none");
  } else {
    document
      .querySelector(".btn--deleteTransaction")
      .classList.remove("d-none");
  }
};

export const closeModal = () => {
  helper.transactionModal.hide();
};

export const openModal = () => {
  helper.transactionModal.show();
};

export const deleteBtnEvent = (handler) => {
  const btnDeleteTrans = document.querySelector(".btn--deleteTransaction");

  btnDeleteTrans.addEventListener("click", function () {
    const id = document.querySelector(".mov--active").dataset.id;
    handler(id);
    helper.transactionModal.hide();
  });
};

const getDateFromDOM = (...classDOM) => {
  const dateStr = classDOM
    .map((el) => {
      return document.getElementById(el).value;
    })
    .join(" ");

  return new Date(dateStr);
};

const modalErrorMarkup = (errorArr) => {
  const errors = [
    "a valid amount",
    "a valid date",
    "a valid date",
    "a date in the past",
  ];
  let markup = "Please insert ";
  errorArr.forEach((el, i, arr) => {
    if (el === true) {
      if (arr.length - 1 === i && arr.length != 1) {
        markup += ` and ${errors[i]}`;
        return;
      }
      markup += `${errors[i]} `;
    }
  });
  return markup;
};

export const submitBtnEvent = (
  newTransactionHandler,
  transactionUpdatedHandler,
  budgetUpdatedHandler,
  transferCreatedHandler,
  updateSavingsAccountHandler
) => {
  const submitBtnModal = document.querySelector(".btn--submitModal");

  submitBtnModal.addEventListener("click", function () {
    const type = this.dataset.type;
    if (type.startsWith("transaction")) {
      const amount = +document.querySelector("#newTransactionAmount").value;
      const category = document.querySelector(".radioTransModal:checked")
        ?.dataset.category;

      const date = getDateFromDOM(
        "getDayModal",
        "getMonthModal",
        "getYearModal"
      );

      const movType = document.querySelector(".check-input--type:checked")
        .dataset.target;

      const possibleErrors = [
        !amount,
        !date,
        isNaN(Date.parse(date)),
        date >= Date.now(),
      ];

      if (possibleErrors.some((el) => el === true)) {
        document.querySelector(".modal-error--message").textContent =
          modalErrorMarkup(possibleErrors);

        document.querySelector(".modal-error").classList.remove("d-none");

        return;
      }

      if (movType === "Transfer") {
        const accFrom = document.querySelector("#selectAccountFrom").value;
        const accFor = document.querySelector("#selectAccountTo").value;
        transferCreatedHandler({ from: accFrom, for: accFor, amount });
      } else {
        const obj = {
          type: movType,
          amount,
          category,
          date: Date.parse(date),
          id: "",
        };

        if (type.endsWith("New")) {
          newTransactionHandler(obj);
        } else {
          obj.id = document.querySelector(".mov--active").dataset.id;
          transactionUpdatedHandler(obj);
        }
      }
    } else if (type === "budget") {
      const newBudget = [...document.querySelectorAll(".input--budget")].map(
        (el) => {
          return {
            name: el.dataset.category,
            value: +el.dataset.value,
            target: Number(el.value),
            native: Boolean(el.dataset.native),
          };
        }
      );
      budgetUpdatedHandler(type, newBudget);
    } else if (type === "Savings") {
      const obj = {
        name: document.querySelector("#foatingAccountName").value,
        goal: document.querySelector("#FloatingAccountGoal").value,
      };
      updateSavingsAccountHandler(obj);
    }

    closeModal();
  });
};

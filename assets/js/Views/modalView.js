"use strict";

import * as helper from "./../bootstrapElements.js";
import * as config from "./../config.js";

const parentElement = document.querySelector("#addTransactionModal");

const generateBudgetMarkup = (budgetObj) => {
  return `<div class="col">
    ${budgetObj
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
  return `${arr
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
};

const generateTransactionMarkup = (budgetObj, mov) => {
  const categoryPicker = mov?.type || "Expense";
  console.log(categoryPicker);
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
      <label class="form-check-label" for="expense-Type--Income">
        Income
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
    <input type="number" id="newTransactionAmount" value="${
      mov?.amount ? mov.amount : 0
    }" />
  
  </div>
  </div>
    `;
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

export const updateModalInfo = (type, budgetObj, mov) => {
  //   parentElement.setAttribute("data-index", index);
  const buttonSubmit = document.querySelector(".btn--submitModal");
  buttonSubmit.setAttribute("data-type", type);

  let markup;

  if (type === "budget") {
    markup = generateBudgetMarkup(budgetObj);
  } else {
    markup = generateTransactionMarkup(budgetObj, mov);
  }

  document.querySelector(".modalContent").innerHTML = "";

  document
    .querySelector(".modalContent")
    .insertAdjacentHTML("afterbegin", markup);

  document
    .querySelector(".check-type")
    ?.addEventListener("click", function (e) {
      updateCategories(e, budgetObj, mov);
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
  const values = classDOM
    .map((el) => {
      return document.getElementById(el).value;
    })
    .join(" ");

  return new Date(values);
};

export const submitBtnEvent = (handler) => {
  const submitBtnModal = document.querySelector(".btn--submitModal");

  submitBtnModal.addEventListener("click", function () {
    const type = this.dataset.type;
    if (type.startsWith("transaction")) {
      const amount = +document.querySelector("#newTransactionAmount").value;
      const category = document.querySelector(".radioTransModal:checked")
        .dataset.category;

      const date = getDateFromDOM(
        "getDayModal",
        "getMonthModal",
        "getYearModal"
      );

      const movType = document.querySelector(".check-input--type:checked")
        .dataset.target;

      if (
        !amount ||
        !category ||
        !date ||
        isNaN(Date.parse(date)) ||
        date > Date.now()
      ) {
        return helper.transactionModal.hide();
      }

      const obj = {
        type: movType,
        amount,
        category,
        date: Date.parse(date),
        id: "",
      };

      if (type.endsWith("New")) {
        handler(type, obj);
      } else {
        obj.id = document.querySelector(".mov--active").dataset.id;
        handler(type, obj);
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
      handler(type, newBudget);
    }

    closeModal();
  });
};

"use strict";

import * as helper from "./../bootstrapElements.js";

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

const generateTransactionMarkup = (budgetObj, mov) => {
  return `<div class="col">
    <div class="form-check">
    ${budgetObj
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
      .join(" ")}
      
  <div class="col my-2">
    <label for="newTransactionAmount">Amount: </label>
    <input type="number" id="newTransactionAmount" value="${
      mov?.amount ? mov.amount : 0
    }" />
  </div>
  </div>
  </div>
    `;
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

export const submitBtnEvent = (handler) => {
  const submitBtnModal = document.querySelector(".btn--submitModal");

  submitBtnModal.addEventListener("click", function () {
    const type = this.dataset.type;
    if (type.startsWith("transaction")) {
      const amount = +document.querySelector("#newTransactionAmount").value;
      const category = document.querySelector(".radioTransModal:checked")
        .dataset.category;

      if (!amount || !category) return helper.transactionModal.hide();

      if (type.endsWith("New")) {
        handler(type, { amount, category });
      } else {
        const id = document.querySelector(".mov--active").dataset.id;
        handler(type, { amount, category, id });
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
      console.log(newBudget);
      handler(type, newBudget);
    }

    closeModal();
  });
};

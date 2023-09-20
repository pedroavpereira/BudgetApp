"use strict";

import * as bootstrap from "bootstrap";

const parentElement = document.querySelector("#addTransactionModal");
const transactionModal = new bootstrap.Modal(parentElement);

const generateBudgetMarkup = (budgetObj) => {
  return `<div class="col">
    ${budgetObj
      .map((el) => {
        return `
    <div class="col my-2">
    <label for="cat${el.name}">${el.name}: </label>
    <input class="input--budget" data-category=${el.name} type="number" id="cat${el.name}" value="${el.target}" />
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

parentElement.addEventListener("hidden.bs.modal", function () {
  if (document.querySelector(".mov--active")) {
    document.querySelector(".mov--active").classList.remove("mov--active");
  }
});

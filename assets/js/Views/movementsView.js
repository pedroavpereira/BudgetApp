"use strict";

import { transactionModal } from "./modal/modalBase.js";

const parentElement = document.querySelector(".transactions--container");

//TODO: add the to localeDateString to its helper function to helper.js in the future
const generateTransactionMarkup = (mov) => {
  if (mov.type === "Transfer") {
    return `<div class="movement--row" data-id="${mov.id}">
    <div class="transaction-section transaction-section__date">${new Date(mov.date).toLocaleDateString(
      "pt-pt",
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    )}</div>
    <div class="transaction-section  transaction-section__category">
      
    <p class="movement-category movement-category--transfer
    }">${mov.category === "In" ? "from" : "To"} ${
      mov[mov.category === "In" ? "from" : "to"]
    }</p> 
    
      
    </div>
    <div class="transaction-section  transaction-section__amount">${Math.abs(mov.amount)}</div>
  </div>
  </div>`;
  } else {
    return `<div class="movement--row" data-id="${mov.id}">
  <div class="transaction-section  transaction-section__date">${new Date(mov.date).toLocaleDateString(
    "pt-pt",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
  )}</div>
  <div class="transaction-section  transaction-section__category">
    <p class="movement-category movement-category--${
      mov.type === "Income" ? "income" : "expense"
    }">${mov.category}</p> 
  </div>
  <div class="transaction-section transaction-section__amount">${Math.abs(mov.amount)}</div>
</div>`;
  }
};

export const renderTransaction = (
  mov,
  selectorDOM = ".transactions--container"
) => {
  const markup = generateTransactionMarkup(mov);

  document.querySelector(selectorDOM).insertAdjacentHTML("afterbegin", markup);
};

export const deleteTransaction = (id) => {
  document.querySelector(`.movement--row[data-id="${id}"]`).innerHTML = "";
};

export const renderAllTransactions = (arr) => {
  parentElement.innerHTML = "";
  if (arr.length > 0) {
    arr.forEach((el) => {
      renderTransaction(el);
    });
  } else {
    //TODO: Add a more comprehensive no transaction message
    parentElement.innerHTML = `<div class="row text-center">
    <div class="col-12 p-3 text-muted">No transactions found</div>
  </div>`;
  }
};

export const movementContainerEvent = (handler) => {
  parentElement.addEventListener("click", function (e) {
    const target = e.target.closest(".movements--row");
    if (!target) return;

    target.classList.add("mov--active");
    handler(target.dataset.id);
    transactionModal.show();
  });
};

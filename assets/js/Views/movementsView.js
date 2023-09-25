"use strict";

import * as bootstrap from "bootstrap";

import * as helper from "./../bootstrapElements.js";

const parentElement = document.querySelector(".movement--container");

export const renderTransaction = (
  mov,
  selectorDOM = ".movement--container"
) => {
  const markup = `<div class="movement--row" data-id="${mov.id}">
    <div class="row text-center" >
    <div class="col-6 col-md-4 p-3">${new Date(mov.date).toLocaleDateString(
      "pt-pt",
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    )}</div>
    <div class="col-4 p-3 d-none d-md-block" style="display:inline;">${
      mov.category
    }  <p  style="display:inline;" class=" inline text-${
    mov.type === "Income" ? "success" : "danger"
  } text-opacity-75">(${mov.type})</p>
    </div>
    <div class="col-6 col-md-4 p-3">${Math.abs(mov.amount)}</div>
  </div>
  </div>`;

  document.querySelector(selectorDOM).insertAdjacentHTML("afterbegin", markup);
};

export const deleteTransaction = (id) => {
  document.querySelector(`.movement--row[data-id="${id}"]`).innerHTML = "";
};

export const renderAllTransactions = (arr) => {
  parentElement.innerHTML = "";
  if (arr.length > 1) {
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
    const target = e.target.closest(".movement--row");
    if (!target) return;

    target.classList.add("mov--active");
    handler(target.dataset.id);
    helper.transactionModal.show();
  });
};

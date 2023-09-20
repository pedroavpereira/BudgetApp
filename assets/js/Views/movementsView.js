"use strict";

import * as bootstrap from "bootstrap";
import * as helper from "./../helper.js";

const parentElement = document.querySelector(".movement--container");

export const renderTransaction = (
  mov,
  selectorDOM = ".movement--container"
) => {
  const markup = `<div class="movement--row" data-id="${mov.id}">
    <div class="row text-center" >
    <div class="col-6 col-md-4 p-3">${mov.date}</div>
    <div class="col-4 p-3 d-none d-md-block">${mov.category}</div>
    <div class="col-6 col-md-4 p-3">${mov.amount}</div>
  </div>
  </div>`;

  document.querySelector(selectorDOM).insertAdjacentHTML("afterbegin", markup);
};

export const deleteTransaction = (id) => {
  document.querySelector(`.movement--row[data-id="${id}"]`).innerHTML = "";
};

export const renderAllTransactions = (arr) => {
  parentElement.innerHTML = "";
  arr.forEach((el) => {
    renderTransaction(el);
  });
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

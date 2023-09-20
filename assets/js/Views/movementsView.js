"use strict";

import * as bootstrap from "bootstrap";

const modal = document.querySelector("#addTransactionModal");
const transactionModal = new bootstrap.Modal(modal);

const btnSubmitModal = document.querySelector(".btn--submitModal");
const btnDeleteTrans = document.querySelector(".btn--deleteTransaction");

export const renderTransaction = (
  mov,
  index,
  selectorDOM = ".movement--container"
) => {
  const markup = `<div class="movement--row" data-index="${index}">
    <div class="row text-center" >
    <div class="col-6 col-md-4 p-3">${mov.date}</div>
    <div class="col-4 p-3 d-none d-md-block">${mov.category}</div>
    <div class="col-6 col-md-4 p-3">${mov.amount}</div>
  </div>
  </div>`;

  document.querySelector(selectorDOM).insertAdjacentHTML("afterbegin", markup);
};

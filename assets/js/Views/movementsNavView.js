"use strict";

import * as bootstrap from "bootstrap";
import * as modalView from "./modalView.js";

const modal = document.querySelector("#addTransactionModal");
const transactionModal = new bootstrap.Modal(modal);

const parentElement = document.querySelector(".movements--nav");

export const addTransactionEvent = (handler) => {
  const element = document.querySelector(".btn--addTransaction");

  element.addEventListener("click", function () {
    handler();
    modalView.openModal();
  });
};

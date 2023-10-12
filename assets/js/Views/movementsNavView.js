"use strict";

import { transactionModal } from "./modal/modalBase.js";
import * as bootstrap from "bootstrap";

const parentElement = document.querySelector(".movements--nav");

const dropdownElement = document.querySelector(".dropdown-toggle");
export const dropdownList = new bootstrap.Dropdown(dropdownElement);

document
  .querySelector(".dropdown-toggle")
  .addEventListener("click", function () {
    dropdownList.toggle();
  });

export const addTransactionEvent = (handler) => {
  const element = document.querySelector(".btn--addTransaction");

  element.addEventListener("click", function () {
    handler();
    transactionModal.show();
  });
};

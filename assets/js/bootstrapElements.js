"use strict";

import * as bootstrap from "bootstrap";

const modalParentElement = document.querySelector("#addTransactionModal");
export const transactionModal = new bootstrap.Modal(modalParentElement);

const dropdownElement = document.querySelector(".dropdown-toggle");
export const dropdownList = new bootstrap.Dropdown(dropdownElement);

document
  .querySelector(".dropdown-toggle")
  .addEventListener("click", function () {
    dropdownList.toggle();
  });

document.querySelector(".btn-close").addEventListener("click", function () {
  transactionModal.hide();
});

modalParentElement.addEventListener("hidden.bs.modal", function () {
  if (document.querySelector(".mov--active")) {
    document.querySelector(".mov--active").classList.remove("mov--active");
  }
});

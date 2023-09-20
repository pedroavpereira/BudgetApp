"use strict";

import * as bootstrap from "bootstrap";

const parentElement = document.querySelector("#addTransactionModal");
export const transactionModal = new bootstrap.Modal(parentElement);

document.querySelector(".btn-close").addEventListener("click", function () {
  transactionModal.hide();
});

parentElement.addEventListener("hidden.bs.modal", function () {
  if (document.querySelector(".mov--active")) {
    document.querySelector(".mov--active").classList.remove("mov--active");
  }
});

"use strict";

import * as helper from "./../bootstrapElements.js";

const parentElement = document.querySelector(".movements--nav");

export const addTransactionEvent = (handler) => {
  const element = document.querySelector(".btn--addTransaction");

  element.addEventListener("click", function () {
    handler();
    helper.transactionModal.show();
  });
};

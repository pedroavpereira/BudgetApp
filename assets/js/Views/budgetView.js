"use strict";

import * as helper from "../bootstrapElements.js";

const parentElement = document.querySelector(".overview--body");

export const renderBudget = (arr) => {
  let markup;
  if (arr.currentAccount.type === "Savings") {
    markup = `<p>${arr.currentAccount.balance} of the goal ${arr.currentAccount.goal}</p>`;
    document.querySelector(".btn--budget").classList.add("d-none");
  } else {
    document.querySelector(".btn--budget").classList.remove("d-none");
    markup = arr.budget
      .map((el) => {
        if (el.value) {
          return `<p class="text-${
            el.value <= el.target ? "success" : "danger"
          }">${el.name} - ${el.value} / ${el.target}</p>`;
        }
      })
      .join(" ");
  }

  parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML("beforeend", markup);
};

export const changeBudgetClicked = (handler) => {
  const btnBudget = document.querySelector(".btn--budget");

  btnBudget.addEventListener("click", function () {
    handler();
    helper.transactionModal.show();
  });
};

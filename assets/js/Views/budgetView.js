"use strict";

import { transactionModal } from "./modal/modalBase.js";

const parentElement = document.querySelector(".overview--body");

export const renderBudget = (arr) => {
  let markup;
    markup = arr.budget
      .map((el) => {
        if (el.value) {
          return `<p class="text-${
            el.value <= el.target ? "success" : "danger"
          }">${el.name} - ${el.value} / ${el.target}</p>`;
        }
      })
      .join(" ");
  

  parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML("beforeend", markup);
};

export const changeBudgetClicked = (handler) => {
  const btnBudget = document.querySelector(".btn--budget");

  btnBudget.addEventListener("click", function () {
    handler();
    transactionModal.show();
  });
};

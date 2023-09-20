"use strict";

const parentElement = document.querySelector(".overview--body");

export const renderBudget = (arr) => {
  const markup = arr
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

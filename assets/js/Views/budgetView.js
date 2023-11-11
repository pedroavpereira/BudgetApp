"use strict";

import { transactionModal } from "./modal/modalBase.js";
import * as config from "../config.js"

const parentElement = document.querySelector(".overview--body");

const colorsMap = config.budgetColours();

export const generatePieChartMarkup = (pie)=>{

  let prevDegree = 0;
  const gradientString = pie.map(el=>{
    const add = `${colorsMap.get(`${el.name}`)} ${prevDegree}deg ${(prevDegree + el.degree).toFixed(4)}deg`
    prevDegree =  +(prevDegree + el.degree).toFixed(4);
    return add
  }).join(",")
  const style = `background: conic-gradient(${gradientString})`
  return `<div class="budget-chart" style="${style}"></div>`
}

const generateIndividualBudgetMarkup = (budgetArr)=>{
  return budgetArr
  .map((el) => {
    if (el.value) {
      return `
      <div class="budget-item">
        <div class="budget-square" style="background-color: ${colorsMap.get(`${el.name}`)};"></div>
        <div>
          <p class="budget-item__info text-${
            el.value <= el.target ? "success" : "danger"
          }">${el.name} - ${el.value} / ${el.target}</p>
        </div>
      </div>
      `;
    }
  })
  .join(" ");
}



export const renderBudget = (arr) => {
  const  markup = `${generatePieChartMarkup(arr.pie)}
  <div class="budget-items">
  ${generateIndividualBudgetMarkup(arr.budget)}
  </div>
  `;
  
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

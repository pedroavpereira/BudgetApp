"use strict";

import { transactionModal } from "./modal/modalBase.js";
import * as config from "../config.js"

const parentElement = document.querySelector(".overview--body");

const colorsMap = config.budgetColours();

export const generatePieChartMarkup = (pie)=>{
  const gradientString = pie.reduce((obj,el)=>{
    obj.string += `${colorsMap.get(`${el.name}`)} ${obj.prevDeg}deg ${(obj.prevDeg + el.degree).toFixed(4)}deg ${el.name!=="other" ? "," : ""}`
    obj.prevDeg =  +(obj.prevDeg + el.degree).toFixed(4);
    return obj
  },{string:"",prevDeg:0});
  const style = `background: conic-gradient(${gradientString.string})`
  return `<div class="budget-chart" style="${style}"></div>`
}

const generateIndividualBudgetMarkup = (budgetArr)=>{
  return budgetArr
  .map((el) => {
    if (el.value) {
      return `
      <div class="budget-square"></div>
      <p class="text-${
        el.value <= el.target ? "success" : "danger"
      }">${el.name} - ${el.value} / ${el.target}</p>`;
    }
  })
  .join(" ");
}



export const renderBudget = (arr) => {
  const  markup = `${generatePieChartMarkup(arr.pie)}
  ${generateIndividualBudgetMarkup(arr.budget)}
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

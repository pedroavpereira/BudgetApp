"use strict";

import { transactionModal } from "./modal/modalBase.js";
import * as config from "../config.js"

const parentElement = document.querySelector(".overview--body");

const colorsMap = config.budgetColours();

export const generatePieChartMarkup = (pie)=>{
  console.log(pie);
  debugger;

  const gradientString = pie.reduce((obj,el)=>{
    if(obj.prevDeg >= 360) return obj;
    obj.string += `${colorsMap.get(`${el.name}`)} ${obj.prevDeg}deg ${(obj.prevDeg + el.degree).toFixed(0)}deg`
    obj.prevDeg =  +(obj.prevDeg + el.degree).toFixed(0);
    if(obj.prevDeg >= 360) return obj;
    obj.string += ", ";
    return obj
  },{string:"",prevDeg:0});
  const style = `background: conic-gradient(${gradientString.string})`
  return `<div class="budget-chart" style="${style}"></div>`
}

const generateIndividualBudgetMarkup = (budgetArr)=>{
  return budgetArr
  .map((el) => {
    if (el.value) {
      return `<p class="text-${
        el.value <= el.target ? "success" : "danger"
      }">${el.name} - ${el.value} / ${el.target}</p>`;
    }
  })
  .join(" ");
}



export const renderBudget = (arr) => {
  console.log(arr);
  let markup = "";
    markup +=  generatePieChartMarkup(arr.pie);
    console.log(markup);
    markup +=  generateIndividualBudgetMarkup(arr.budget);
  

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

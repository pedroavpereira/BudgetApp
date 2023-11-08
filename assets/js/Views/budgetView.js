"use strict";

import { transactionModal } from "./modal/modalBase.js";
import * as config from "../config.js"

const parentElement = document.querySelector(".overview--body");

const colorsMap = config.budgetColours();

export const generatePieChartMarkup = (pie)=>{
  const gradientString = pie.reduce((obj,el)=>{
    if(obj.prevDeg > 360) return obj
    obj.string += `${colorsMap.get(`${el.name}`)} ${obj.prevDeg}deg ${obj.prevDeg + el.degree}deg `
    obj.prevDeg = obj.prevDeg + el.degree;
    return obj
  },{string:"",prevDeg:0});
  const style = `background: repeating-conic-gradient(${gradientString.string})`
  console.log(`<div class="budget-chart" style="${style}"></div>`);

  return `<div class="budget-chart" style="${style}"></div>`
}



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

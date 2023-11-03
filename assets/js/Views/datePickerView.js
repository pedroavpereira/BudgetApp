import * as config from "./../config.js"

const generateYearMarkup = (year) =>{
    return `<div class="datepicker-input__container">
    <input type="radio" name="year" class="datepicker-radios datepicker-radio__year" id="datepicker-year__${year}" value="${year}">
    <label class="datepicker-label datepicker-month__label" for="datepicker-year__${year}">${year}</label>
  </div>`
}

export const generateYears = (obj) =>{
    const yearContainer = document.querySelector(".datepicker-container__years");
    yearContainer.innerHTML = "";

    let year = obj.earliest.year;

    while (year <= new Date().getFullYear()) {
        const markup = generateYearMarkup(year);
        yearContainer.insertAdjacentHTML("beforeend", markup);
        year++;
      }
}

export const selectDate = (date)=>{
  const year = new Date(date).getFullYear();
  const month = config.months[ new Date(date).getMonth()].toLowerCase();;
  console.log(year,month)
  document.querySelector(`#datepicker-year__${year}`).checked = true;
  document.querySelector(`#datepicker-month__${month}`).checked = true;
}
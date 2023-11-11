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

    document.getElementById(`datepicker-year__${obj.yearSelected}`).checked = true;
}

export const selectDate = (date)=>{
  const year = new Date(date).getFullYear();
  const month = config.months[ new Date(date).getMonth()].toLowerCase();
  document.querySelector(`#datepicker-year__${year}`).checked = true;
  document.querySelector(`#datepicker-month__${month}`).checked = true;
}

export const datePickerEvent = (handler)=>{
  const parentElement = document.querySelector(".datepicker-form__element");

  parentElement.addEventListener("click",function(e){

    e.preventDefault()
    const target = e.target.closest(".datepicker-input__container");
    if(!target) return

    target.querySelector("input").checked = true;
    const formData = new FormData(this);
    const formObj = Object.fromEntries(formData);

    const newDate = Date.parse(`01 ${formObj.month} ${formObj.year}`)
    handler(newDate)

  })
}
import * as config from "../../../config.js";

const generateTransTypeMarkup = (stateObj) => {
  return `
    <input class="form-check-input check-input--type  form-input modal-checkbox--input modal-checkbox--input__expense" type="radio" name="type" id="transaction-type--Expense" data-target="Expense" value="Expense" checked>
    <label class="form-check-label modal-checkbox--label" for="transaction-type--Expense">
    Expense
    </label>
        
      <div class="modal-grid--content">${generateCategoriesCheckboxes(
        stateObj,
        "Expense"
      )}</div>
    
      <input class="form-check-input check-input--type modal-checkbox--input modal-checkbox--input__income" type="radio" name="type" id="transaction-type--Income" value="Income" data-target="Income">
        <label class="form-check-label modal-checkbox--label" for="transaction-type--Income">
        Income
        </label>
        <div class="modal-grid--content">${generateCategoriesCheckboxes(
          stateObj,
          "Income"
        )}</div>
        <input class="form-check-input check-input--type modal-checkbox--input modal-checkbox--input__transfer" type="radio" name="type" id="transaction-type--Transfer" data-target="Transfer" value="Transfer" ${
          stateObj.accounts.length <= 1 ? "disabled" : ""
        }>
        <label class="form-check-label modal-checkbox--label" for="transaction-type--Transfer">
        Transfer
        </label>
        <div class="modal-grid--content">${generateCategoriesCheckboxes(
          stateObj,
          "Transfer"
        )}</div>
      `;
};

const generateDatePickerMarkup = () => {
  return `<div class="col my-2">
      <input type="number" class=" col-2 datePickerModal" name="day"  id="getDayModal" value ="${new Date().getDate()}"/>
      <select class="datePickerModal col-2" name="month" id="getMonthModal">
        ${config.months
          .map((el, i) => {
            return `<option value="${el}" ${
              new Date().getMonth() === i ? "selected" : ""
            }>${el}</option>`;
          })
          .join("")}
      </select>
  
      <input type="number" class="datePickerModal col-2" name="year" id="getYearModal" value="${new Date().getFullYear()}" />
      </div>`;
};

const transferContentMarkup = (stateObj) => {
  return `
        <label class="form-check-label" for="selectAccountFrom">From: </label>
        <select
        name="from"
        class="form-select form-select-sm form-select--from"
        id="selectAccountFrom"
        value= "${stateObj.currentAccount.name}"
      >
      <option value="${stateObj.currentAccount.name}">${
    stateObj.currentAccount.name
  }</option>
      </select>
      <label class="form-check-label" for="selectTransferTo">To </label>
      <select name="to" class="form-select form-select-sm" id="selectAccountTo">
      ${stateObj.accounts
        .map((el) => {
          return `<option value="${el.name}" ${
            el != stateObj.currentAccount ? "selected" : "disabled"
          }>${el.name}</option>`;
        })
        .join(" ")}
      </select>
        `;
};

const transactionCheckboxesMarkup = (stateObj, type) => {
  return `${stateObj.budget
    .filter((el) => el.type === type)
    .map((el, i) => {
      return `<div class="form-check modal-checkbox--container">
            <input
          class="form-check-input radioTransModal modal-checkbox--input"
          type="radio"
          name="${type}Category"
          id="modal-cat--${el.name}"
          value="${el.name}"
          data-category="${el.name}"
          ${i === 0 ? "checked" : ""}
        />
        <label class="form-check-label modal-checkbox--label" for="modal-cat--${
          el.name
        }">
        ${el.name}
        </label>
        </div>`;
    })
    .join(" ")}`;
};

const generateCategoriesCheckboxes = (stateObj, type = "Expense") => {
  if (type === "Transfer") {
    return transferContentMarkup(stateObj);
  } else {
    return transactionCheckboxesMarkup(stateObj, type);
  }
};

export const generateContent = (stateObj, type) => {
  return `
    <div class="modal-content--container modal-content--transactions">
      ${generateTransTypeMarkup(stateObj)}
  
      <fieldset class="modal-transaction--fieldset modal-section-date">
      <legend class="modal-transaction--legend">Date:</legend>
      ${generateDatePickerMarkup()}
      </fieldset>
      
        
      <fieldset class="modal-transaction--fieldset modal-section-amount">
      <legend class="modal-transaction--legend">Amount:</legend>  
      <input type="number" name="amount"  id="newTransactionAmount" value ="0"/>
  
    </div>
      `;
};

export const formValidatedData = (formData) => {
  if (formData.type === "Expense" || formData.type === "Income") {
    return (
      formData.amount > 0 &&
      formData.day &&
      formData.month &&
      formData.year && {
        type: formData.type,
        category:
          formData.type === "Expense"
            ? formData.ExpenseCategory
            : formData.IncomeCategory,
        amount: Number(formData.amount),
        date: Date.parse(
          new Date(`${formData.day} ${formData.month} ${formData.year}`)
        ),
      }
    );
  }
};

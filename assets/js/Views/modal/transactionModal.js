import * as modalBase from "./modalBase.js";
import * as config from "./../../config.js";

const generateTransTypeMarkup = (stateObj) => {
  return `
  <input class="form-check-input check-input--type  form-input modal-checkbox--input modal-checkbox--input__expense" type="radio" name="type" id="transaction-type--Expense" data-target="Expense" value="Expense" checked>
  <label class="form-check-label modal-checkbox--label" for="transaction-type--Expense">
  Expense
  </label>
      
    <div class="modal-category--content">${generateCategoriesCheckboxes(stateObj, "Expense")}</div>
  
    <input class="form-check-input check-input--type modal-checkbox--input modal-checkbox--input__income" type="radio" name="type" id="transaction-type--Income" value="Income" data-target="Income">
      <label class="form-check-label modal-checkbox--label" for="transaction-type--Income">
      Income
      </label>
      <div class="modal-category--content">${generateCategoriesCheckboxes(stateObj, "Income")}</div>
      <input class="form-check-input check-input--type modal-checkbox--input modal-checkbox--input__transfer" type="radio" name="type" id="transaction-type--Transfer" data-target="Transfer" value="Transfer" ${
        stateObj.accounts.length <= 1 ? "disabled" : ""
      }>
      <label class="form-check-label modal-checkbox--label" for="transaction-type--Transfer">
      Transfer
      </label>
      <div class="modal-category--content">${generateCategoriesCheckboxes(stateObj, "Transfer")}</div>
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
        name="category"
        id="modal-cat--${el.name}"
        value="${el.name}"
        data-category="${el.name}"
        ${i === 0 && el.type === "Expense" ? "checked" : ""}
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

const generateContentMarkup = (stateObj, type) => {
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

const createOptionsObj = (mov) => {
  if (mov) {
    return {
      title: `Transaction on ${new Date(mov.date).toLocaleDateString("pt-pt", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })}`,
      submitBtn: ["Update", "updateTrans"],
      deleteBtn: ["Delete", true],
    };
  } else {
    return {
      title: `Add new Transaction`,
      submitBtn: ["Add transaction", "newTrans"],
    };
  }
};

const movFillInputs = (mov) => {
  document.getElementById(`transaction-type--${mov.type}`).checked = true;
  document.getElementById(`modal-cat--${mov.category}`).checked = true;

  document.querySelector(`#newTransactionAmount`).value = Math.abs(mov.amount);
  const date = new Date(mov.date);
  document.querySelector("#getDayModal").value = date.getDate();
  document.querySelector(`#getMonthModal`).value =
    config.months[date.getMonth()];
  document.querySelector("#getYearModal").value = date.getFullYear();
};

export const renderTransactionModal = (stateObj, mov) => {
  const markup = generateContentMarkup(stateObj, mov ? mov.type : "Expense");
  modalBase.updateBaseModal(createOptionsObj(mov));
  modalBase.insertHTML(markup);
  modalBase.transactionModal.show();
  if (mov) movFillInputs(mov);
};

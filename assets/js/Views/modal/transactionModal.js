import * as modalBase from "./modalBase.js";
import * as config from "./../../config.js";
import * as bootstrapElements from "./../../bootstrapElements.js";

const generateTransTypeMarkup = () => {
  return `<div class="row check-type">
  <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expense-Type--Expense" data-target="Expense" checked>
      <label class="form-check-label" for="expense-Type--Expense">
        Expense
      </label>
      </div>
      <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expense-Type--Income" data-target="Income">
      <label class="form-check-label" for="expense-Type--Income">
        Income
      </label>
    </div>
    <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expense-Type--Transfer" data-target="Transfer">
      <label class="form-check-label" for="expense-Type--Transfer">
        Transfer
      </label>
    </div>
    </div>`;
};

const generateDatePickerMarkup = () => {
  return `<div class="col my-2">
    <label class"col-2" for="newTransactionAmount">Date: </label>
    <input type="number" class=" col-2 datePickerModal"  id="getDayModal" value ="${new Date().getDate()}"/>
    <select class="datePickerModal col-2" id="getMonthModal">
      ${config.months
        .map((el, i) => {
          return `<option value="${el}" ${
            new Date().getMonth() === i ? "selected" : ""
          }>${el}</option>`;
        })
        .join("")}
    </select>

    <input type="number"  class="datePickerModal col-2" id="getYearModal" value="${new Date().getFullYear()}" />
    </div>`;
};

const transferContentMarkup = (stateObj) => {
  return `
      <label class="form-check-label" for="selectAccountFrom">From: </label>
      <select
      name="month"
      class="form-select form-select-sm"
      id="selectAccountFrom" disabled 
    >
    <option value="${stateObj.currentAccount.name}" >${
    stateObj.currentAccount.name
  }</option>
    </select>
    <label class="form-check-label" for="selectTransferTo">To </label>
    <select name="month" class="form-select form-select-sm" id="selectAccountTo">
    ${stateObj.accounts
      .map((el) => {
        return `<option value="${el.name}" ${
          el != stateObj.currentAccount ? "selected" : ""
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
      return `<div class="form-check">
          <input
        class="form-check-input radioTransModal"
        type="radio"
        name="radioCategory"
        id="modal-cat--${el.name}"
        data-category="${el.name}"
        ${i === 0 ? "checked" : ""}
      />
      <label class="form-check-label" for="modal-cat--${el.name}">
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
  return `<div class="col">
    ${generateTransTypeMarkup()}
    ${generateDatePickerMarkup()}
    
      
      <div class="col my-2 modal-transaction--categories">
    ${generateCategoriesCheckboxes(stateObj, type)}
    </div>
      
  <div class="col my-2">
    <label for="newTransactionAmount">Amount: </label>
    <input type="number"  id="newTransactionAmount" value ="0"/>
  
  </div>
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
  if (mov.type === "Expense" || mov.type === "Income") {
    // BUG NOT WORKING NO IDEA WHY
    document.getElementById(`modal-cat--${mov.category}`).checked = true;
  } else if (mov.type === "Transfer") {
  }
  document.querySelector(`#newTransactionAmount`).value = Math.abs(mov.amount);
  const date = new Date(mov.date);
  document.querySelector("#getDayModal").value = date.getDate();
  document.querySelector(`#getMonthModal`).value =
    config.months[date.getMonth()];
  document.querySelector("#getYearModal").value = date.getFullYear();
};

const typeChanged = (stateObj, mov, type) => {
  generateBudgetCheckboxes(stateObj, type);
};

export const renderTransactionModal = (stateObj, mov) => {
  const markup = generateContentMarkup(stateObj, mov ? mov.type : "Expense");
  modalBase.updateBaseModal(createOptionsObj(mov));
  modalBase.insertHTML(markup);
  bootstrapElements.transactionModal.show();
  if (mov) movFillInputs(mov);

  modalBase.typePickerEvent(stateObj, mov, generateCategoriesCheckboxes);
};

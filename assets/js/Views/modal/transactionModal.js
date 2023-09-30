import * as parentView from "./modalBase.js";
import * as config from "./../../config.js";

const generateTransTypeMarkup = (mov) => {
  return `<div class="row check-type">
  <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expense-Type--Expense" data-target="Expense" checked>
      <label class="form-check-label" for="expense-Type--Expense">
        Expense
      </label>
      </div>
      <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expenseTypeIncome" data-target="Income" ${
        mov?.type === "Income" ? "checked" : ""
      }>
      <label class="form-check-label" for="expense-Type--Transfer">
        Income
      </label>
    </div>
    <div class="form-check col-3">
      <input class="form-check-input check-input--type" type="radio" name="expense-type" id="expenseTypeIncome" data-target="Transfer" ${
        mov?.type === "Transfer" ? "checked" : ""
      }>
      <label class="form-check-label" for="expense-Type--Income">
        Transfer
      </label>
    </div>
    </div>`;
};

const generateDatePickerMarkup = (mov) => {
  return `<div class="col my-2">
    <label class"col-2" for="newTransactionAmount">Date: </label>
    <input type="number" class=" col-2 datePickerModal"  id="getDayModal" value="${
      mov?.date ? new Date(mov.date).getDate() : new Date().getDate()
    }" />
    <select class="datePickerModal col-2" id="getMonthModal">
      ${config.months
        .map((el, i) => {
          return `<option value="${el}" ${
            mov?.date
              ? new Date(mov.date).getMonth() === i
                ? "selected"
                : ""
              : new Date().getMonth() === i
              ? "selected"
              : ""
          }>${el}</option>`;
        })
        .join("")}
    </select>

    <input type="number"  class="datePickerModal col-2" id="getYearModal" value="${
      mov?.date ? new Date(mov.date).getFullYear() : new Date().getFullYear()
    }" />
    </div>`;
};

const transferCheckboxesMarkup = (stateObj) => {
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

const transactionCheckboxesMarkup = (stateObj, mov) => {
  const type = mov ? mov.type : "Expense";
  return `${stateObj.budget
    .filter((el) => el.type === type)
    .map((el, i) => {
      return `<div class="form-check">
          <input
        class="form-check-input radioTransModal"
        type="radio"
        name="radioCategory"
        id="cat${el.name}"
        ${mov?.category === el.name || i === 0 ? "checked" : ""}
        data-category="${el.name}"
      />
      <label class="form-check-label" for="cat${el.name}">
      ${el.name}
      </label>
      </div>`;
    })
    .join(" ")}`;
};

const generateBudgetCheckboxes = (stateObj, mov) => {
  const type = mov ? mov.type : "Expense";

  if (type === "Transfer") {
    return transferCheckboxesMarkup(stateObj);
  } else {
    return transactionCheckboxesMarkup(stateObj, mov);
  }
};

const generateContentMarkup = (stateObj, mov) => {
  return `<div class="col">
    ${generateTransTypeMarkup(mov)}
    ${generateDatePickerMarkup(mov)}
    
      
      <div class="col my-2 modal-transaction--categories">
    ${generateBudgetCheckboxes(stateObj, mov)}
    </div>
      
  <div class="col my-2">
    <label for="newTransactionAmount">Amount: </label>
    <input type="number"  id="newTransactionAmount" value="${
      mov?.amount ? Math.abs(mov.amount) : 0
    }" />
  
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

export const renderTransactionModal = (stateObj, mov) => {
  const markup = generateContentMarkup(stateObj, mov);
  parentView.updateBaseModal(createOptionsObj(mov));
  parentView.insertHTML(markup);
};

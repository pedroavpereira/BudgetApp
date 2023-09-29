import * as parentView from "./modal.js";

const modalContent = document.querySelector(".modalContent");

const generateTransactionMarkup = (trans) => {
  return `<div>
    <div class="form-floating">
    <select class="form-select" id="floatingSelect" aria-label="Floating label select example" disabled>
    <option value="1" selected>${trans.from}</option>
    </select>
    <label for="floatingSelect">From</label>
    </div>
    <div class="form-floating mt-2 mb-2">
    <select class="form-select" id="floatingSelect" aria-label="Floating label select example" disabled>
    <option value="1" selected>${trans.to}</option>
    </select>
    <label for="floatingSelect">To</label>
    </div>
    <div class="form-floating">
    <select class="form-select" id="floatingSelect" aria-label="Floating label select example" disabled>
    <option value="1" selected>${trans.amount}</option>
    </select>
    <label for="floatingSelect">Amount</label>
    </div>
    </div>
  </div>`;
};

const generateAccSumMarkup = (accObj) => {
  return `<div>
  <div class="form-floating mb-3">
    <input
      type="name"
      class="form-control"
      id="foatingAccountName"
      placeholder="${accObj.name}"
      value = "${accObj.name}"
    />
    <label for="foatingAccountName">AccountName</label>
  </div>
  <div class="form-floating">
  <select class="form-select" id="floatingSelect" aria-label="Floating label select example" disabled>
  <option value="1" selected>${accObj.type}</option>
  </select>
  <label for="floatingSelect">Account Type</label>
  </div>
  <div class="form-floating mt-3">
    <input
      type="Number"
      class="form-control"
      id="FloatingAccountGoal"
      placeholder="${accObj.goal}"
      value = "${accObj.goal}"
    />
    <label for="FloatingAccountGoal">Account Goal</label>
  </div>
</div>`;
};

const clearContent = () => {
  modalContent.innerHTML = "";
};

const insertHTML = (markup) => {
  clearContent();
  modalContent.insertAdjacentHTML("afterbegin", markup);
};

export const renderAccountSum = (accObj) => {
  const markup = generateAccSumMarkup(accObj);
  parentView.updateBaseModal({
    title: `Savings: ${accObj.name}`,
    submitBtn: ["Update Account", "SavingsAccount"],
  });
  insertHTML(markup);
};

export const renderTransactionSum = (trans) => {
  const markup = generateTransactionMarkup(trans);
  parentView.updateBaseModal({
    title: `Transfer from: ${new Date(trans.date).toLocaleDateString("pt-pt", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })}`,
    submitBtn: ["Close", "SavingsTrans"],
    deleteBtn: ["Delete", true],
  });
  insertHTML(markup);
};

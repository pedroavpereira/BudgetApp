import * as modalBase from "./modalBase.js";

const modalContent = document.querySelector(".modalContent");

let selectedAccount;

const generateModalTypeMarkup = () => {
  return `
  <div class="modal-content--container modal-content--savings">
      <input class="form-check-input check-input--type form-input modal-checkbox--input" type="radio" name="account" id="transaction-type--withdrawl" data-target="Withdrawl" value="${selectedAccount.accountID}" checked>
      <label class="form-check-label modal-checkbox--label" for="transaction-type--withdrawl">
        Withdral
      </label>
      <div class="modal-grid--content">${generateWithdrawlMarkup()}</div>
      <input class="form-check-input check-input--type modal-checkbox--input" type="radio" name="account" id="transaction-type--account" value="${selectedAccount.accountID}" data-target="account">
      <label class="form-check-label modal-checkbox--label" for="transaction-type--account">
        Account
      </label>
      <div class="modal-grid--content">${generateAccSumMarkup()}</div>
      `;
};

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
    </div>`;
};

const generateWithdrawlMarkup = () => {
  return ` <div>
  <label for="withdrawSavings" class="form-label">Amount: </label>
  <input
    type="number"
    name="amount"
    id="withdrawSavings"
    class="form-control"
    value="0"
  />
  <p>All withdrawls will be automatically added to your main account</p>
</div>`;
};

const generateInitialMarkup = () => {
  return `${generateModalTypeMarkup()}`
};

const generateAccSumMarkup = () => {
  return `
  <div class="modal--content">
  <div class="form-floating mb-3">
    <input
      type="name"
      class="form-control"
      id="foatingAccountName"
      name="name"
      placeholder="${selectedAccount.name}"
      value="${selectedAccount.name}"
    />
    <label for="foatingAccountName">AccountName</label>
  </div>
  <div class="form-floating">
    <select
      class="form-select"
      id="floatingSelect"
      aria-label="Floating label select example"
      disabled
    >
      <option value="1" selected>${selectedAccount.type}</option>
    </select>
    <label for="floatingSelect">Account Type</label>
  </div>
  <div class="form-floating mt-3">
    <input
      type="Number"
      class="form-control"
      id="FloatingAccountGoal"
      placeholder="${selectedAccount.goal}"
      value="${selectedAccount.goal}"
      name="goal"
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

const typePickerEvent = (handler) => {
  const parentElement = document.querySelector(".check-type");

  parentElement.addEventListener("click", function (e) {
    handler(e);
  });
};

const updateModalContent = (e) => {
  const target = e.target.dataset.target;
  if (!target) {
    return;
  }

  const modalContentElement = document.querySelector(".modal--content");
  modalContentElement.innerHTML = "";

  if (target === "account") {
    modalContentElement.insertAdjacentHTML(
      "afterbegin",
      generateAccSumMarkup()
    );
    modalBase.updateBaseModal({
      submitBtn: ["Update Account", "updateAccount"],
    });
  } else {
    modalContentElement.insertAdjacentHTML(
      "afterbegin",
      generateWithdrawlMarkup()
    );
    modalBase.updateBaseModal({
      submitBtn: ["Withdrawl", "savingsWithdrawl"],
    });
  }
};

export const renderAccountSum = (accObj) => {
  selectedAccount = accObj;
  modalBase.transactionModal.show();
  const markup = generateInitialMarkup();
  modalBase.updateBaseModal({
    title: `Account: ${selectedAccount.name}`,
    submitBtn: ["Withdraw", "savingsWithdrawl"],
  });
  modalBase.insertHTML(markup);
  typePickerEvent(updateModalContent);
};

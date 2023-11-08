import * as modalBase from "./modalBase.js";

let selectedAccount;

const generateMarkup = () => {
  return `
  <div class="modal-content--container modal-content--savings">
      <input class="form-check-input check-input--type form-input modal-checkbox--input" type="radio" name="type" id="transaction-type--withdrawl" data-target="Withdrawl" value="withdrawl" checked>
      <label class="form-check-label modal-checkbox--label" for="transaction-type--withdrawl">
        Withdral
      </label>
      <div class="modal-grid--content">${generateWithdrawlMarkup()}</div>
      <input class="form-check-input check-input--type modal-checkbox--input" type="radio" name="type" id="transaction-type--account" value="account" data-target="account">
      <label class="form-check-label modal-checkbox--label" for="transaction-type--account">
        Account
      </label>
      <div class="modal-grid--content">${generateAccSumMarkup()}</div>
      <div class="display-none"><input type="text" name="account" value="${selectedAccount.accountID}"></div>
      `;
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



export const renderSavingsModal = (accObj) => {
  selectedAccount = accObj;
  modalBase.transactionModal.show();
  const markup = generateMarkup();
  modalBase.updateBaseModal({
    title: `Account: ${selectedAccount.name}`,
    submitBtn: ["Continue", "savingsModal"],
  });
  modalBase.insertHTML(markup);
};

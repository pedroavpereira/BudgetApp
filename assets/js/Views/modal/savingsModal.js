import * as modalBase from "./modalBase.js";
import * as alertView from "./../alertView.js";

let selectedAccount;

const generateModal = (markup) => {
  return `<div class="modal__i">
  <form action="">
    <div class="modal-header__i">
      <h1 class="modal-tittle__i">Account : ${selectedAccount.name}</h1>
      <span class="modal-close__i">&#10060</span>
    </div>
    <div class="modal-content__i">
      ${markup}
    </div>
    <div class="modal-footer__i">
      <button type="button" class="btn modal-btn modal-btn__cancel">
        Close
      </button>
      <button type="submit" class="btn modal-btn modal-btn__submit">
        Update
      </button>
    </div>
  </form>
</div>
<div class="overlay__i"></div>`;
};

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
      </div>
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

const formValidation = (formData) => {
  let validatedData;

  if (formData.type === "withdrawl") {
    if (formData.amount <= 0 || isNaN(formData.amount)) {
      alertView.displayAlert("Please insert a valid amount", "error");
      return;
    }
    validatedData = {
      type: formData.type,
      amount: Number(formData.amount),
    };
  }

  if (formData.type === "account") {
    if (!formData.name || formData.goal <= 0 || isNaN(formData.goal)) {
      alertView.displayAlert("Invalid values", "error");
      return;
    }
    validatedData = {
      type: formData.type,
      name: formData.name,
      goal: Number(formData.goal),
    };
  }
  return validatedData;
};

export const renderSavingsModal = (
  accObj,
  handleUpdateAccount,
  handleWithdrawl
) => {
  selectedAccount = accObj;
  const markup = generateMarkup();
  const modalMarkup = generateModal(markup);
  modalBase.insertModal(modalMarkup);
  modalBase.addClosingEventListeners([".modal-btn__cancel"]);

  document
    .querySelector(".modal__i form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const id = selectedAccount.accountID;

      const formData = new FormData(this);
      const dataArr = [...formData];
      const data = Object.fromEntries(dataArr);

      const validatedData = formValidation(data);

      if (!validatedData) return;

      validatedData.account = id;
      if (validatedData.type === "withdrawl") {
        handleWithdrawl(validatedData);
      }

      if (validatedData.type === "account") {
        handleUpdateAccount(validatedData);
      }

      modalBase.destroyModal();
    });
};

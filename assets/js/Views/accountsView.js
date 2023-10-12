"use strict";

const parentElement = document.querySelector(".accounts-container--list");

const generateAccountMarkup = (account) => {
  return `<div class="row accounts-row p-2 accounts-event accounts-acc--container" data-target="account" data-account-id=${
    account.accountID
  }>
  <div class="col-8" ><i class="bi text-primary bi-${
    account.type === "Savings"
      ? "bank"
      : account.type === "Investing"
      ? "currency-exchange"
      : "credit-card"
  }"></i> ${account.name}</div>
  ${
    account.accountID != "native"
      ? `<div class="col-4" >
      <button
  type="button"
  class="btn btn-sm btn-outline-danger accounts-event accounts-btn--delete"
  data-target="deleteAccount" data-account-id="${account.accountID}"
><i class="bi bi-trash"></i>
</button> </div>`
      : ""
  }
</div>`;
};

const generateNewAccountMarkup = () => {
  return `<div class="row accounts-row p-2">
  <div class="col"></div>
</div>`;
};

export const renderAccounts = (arr) => {
  parentElement.innerHTML = "";

  const markup = arr.map((account) => generateAccountMarkup(account)).join(" ");
  parentElement.insertAdjacentHTML("afterbegin", markup);
};

const toggleNewAccountForm = (addClass, removeClass) => {
  document.querySelector(addClass).classList.add("d-none");
  document.querySelector(removeClass).classList.remove("d-none");
};

export const accountContainerEvent = (
  handlerChangeAccount,
  handlerAddAccount,
  handlerDeleteAccount
) => {
  document
    .querySelector(".accounts-container")
    .addEventListener("click", function (e) {
      const target = e.target.closest(".accounts-event");
      if (!target) return;
      const datasetTarget = target.dataset;
      const formInput = document.querySelector(".accounts-form--input");
      const accountTypeSelect = document.querySelector("#selectAccountType");
      if (datasetTarget.target === "account") {
        handlerChangeAccount(datasetTarget.accountId);
      } else if (datasetTarget.target === "addAccount") {
        if (!formInput) return;
        handlerAddAccount({
          name: formInput.value,
          type: accountTypeSelect.value,
        });
        formInput.value = "";
        toggleNewAccountForm(".accounts-form", ".accounts-display--form");
      } else if (datasetTarget.target === "cancelAdition") {
        formInput.value = "";
        toggleNewAccountForm(".accounts-form", ".accounts-display--form");
      } else if (datasetTarget.target === "display-newAccountForm") {
        toggleNewAccountForm(".accounts-display--form", ".accounts-form");
      } else if (datasetTarget.target === "deleteAccount") {
        handlerDeleteAccount(datasetTarget.accountId);
      }
    });
};

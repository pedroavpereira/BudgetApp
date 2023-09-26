"use strict";

const parentElement = document.querySelector(".accounts-container--list");

const generateAccountMarkup = (account) => {
  return `<div class="row accounts-row p-2 accounts-event" data-target="account" data-account-id=${account.accountID}>
  <div class="col" >${account.name}</div>
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
  handlerAddAccount
) => {
  document
    .querySelector(".accounts-container")
    .addEventListener("click", function (e) {
      const target = e.target.closest(".accounts-event");
      if (!target) return;
      const datasetTarget = target.dataset;
      const formInput = document.querySelector(".accounts-form--input");
      if (datasetTarget.target === "account") {
        handlerChangeAccount(datasetTarget.accountId);
      } else if (datasetTarget.target === "addAccount") {
        if (!formInput) return;
        handlerAddAccount(formInput.value);
        formInput.value = "";
        toggleNewAccountForm(".accounts-form", ".accounts-display--form");
      } else if (datasetTarget.target === "cancelAdition") {
        formInput.value = "";
        toggleNewAccountForm(".accounts-form", ".accounts-display--form");
      } else if (datasetTarget.target === "display-newAccountForm") {
        toggleNewAccountForm(".accounts-display--form", ".accounts-form");
      }
    });
};

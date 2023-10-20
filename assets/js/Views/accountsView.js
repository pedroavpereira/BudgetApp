"use strict";

const parentElement = document.querySelector(".accounts-container--list");

const generateProgressBarMarkup = (account) => {
  if (!account.goal) return "";
  const progress =
    account.balance / account.goal > 1
      ? 100
      : (account.balance / account.goal) * 100;
  return `<div class="progress-container">
  <div class="progress-box">
    <p class="goal">${
      progress === 100
        ? "Goal Achieved"
        : `Goal: ${account.goal} (${Math.trunc(progress)}%)`
    }</p>
  </div>
  <div class="skill-bar">
    <div class="skill-per" style="width: ${progress}%"></div>
  </div>
</div>`;
};

const generateAccountMarkup = (account) => {
  return `<div class="row accounts-row p-2 accounts-event accounts-acc--container" data-target="account" data-account-id=${
    account.accountID
  }>
  <div class="account--name__container">
  <p class="account--name"><i class="bi text-primary bi-${
    account.type === "Savings"
      ? "bank"
      : account.type === "Investing"
      ? "currency-exchange"
      : "credit-card"
  }"></i> ${
    account.name.length > 13 ? `${account.name.slice(0, 12)}...` : account.name
  }</p>

  <p class="account--balance">${account.balance}£</p>

  </div>
  ${account.accountID != "native" ? generateProgressBarMarkup(account) : ""}
  ${
    account.accountID != "native"
      ? `
      <button
  type="button"
  class="btn btn-sm btn-danger accounts-event accounts-btn--delete"
  data-target="deleteAccount" data-account-id="${account.accountID}"
><i class="bi bi-trash"></i>
</button>`
      : ""
  }
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

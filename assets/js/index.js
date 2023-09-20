"use stict";
import * as bootstrap from "bootstrap";
import * as View from "./Views/movementsView.js";
import * as overviewView from "./Views/overviewView.js";
import * as modalView from "./Views/modalView.js";
import * as Model from "./Model.js";

const modal = document.querySelector("#addTransactionModal");
const transactionModal = new bootstrap.Modal(modal);

const btnSubmitModal = document.querySelector(".btn--submitModal");
const btnDeleteTrans = document.querySelector(".btn--deleteTransaction");

const saveLocalStorage = () => {
  localStorage.setItem("state", JSON.stringify(Model.state));
};

btnSubmitModal.addEventListener("click", function (e) {
  const type = this.dataset.type;

  if (type.startsWith("transaction")) {
    const amount = document.querySelector("#newTransactionAmount").value;
    const category = document.querySelector(".radioTransModal:checked").dataset
      .category;
    if (!amount || !category) return;

    if (type.endsWith("New")) {
      const newTransaction = Model.createTransaction(+amount, category);
      const index = Model.state.currentAccount.movements.length - 1;
      View.renderTransaction(newTransaction, index);
    } else {
      const index = document.querySelector(".mov--active").dataset.index;
      const updatedTransaction = Model.updateTransaction(
        Model.state.currentAccount.movements[index],
        amount,
        category
      );
      document.querySelector(
        `.movement--row[data-index="${index}"]`
      ).innerHTML = "";
      View.renderTransaction(
        updatedTransaction,
        index,
        `.movement--row[data-index="${index}"]`
      );
    }
  } else if (type === "budget") {
    const newBudget = [...document.querySelectorAll(".input--budget")].map(
      (el) => {
        return { name: el.dataset.category, target: Number(el.value) };
      }
    );
    newBudget.forEach((el) => {
      const newBudgetEl = Model.state.currentAccount.budget.find(
        (budgetEl) => budgetEl.name === el.name
      );
      newBudgetEl.target = el.target;
    });
  }

  overviewView.renderBudget(Model.state.currentAccount.budget);
  saveLocalStorage();
});

document
  .querySelector(".movement--container")
  .addEventListener("click", function (e) {
    const target = e.target.closest(".movement--row");
    if (!target) return;

    target.classList.add("mov--active");
    const mov = Model.state.currentAccount.movements[target.dataset.index];

    modalView.updateModalInfo(
      "transaction",
      Model.state.currentAccount.budget,
      mov
    );

    transactionModal.show();
  });

document
  .querySelector(".btn--addTransaction")
  .addEventListener("click", function () {
    modalView.updateModalInfo(
      "transactionNew",
      Model.state.currentAccount.budget
    );
    transactionModal.show();
  });

btnDeleteTrans.addEventListener("click", function () {
  const index = document.querySelector(".mov--active").dataset.index;
  const mov = Model.state.currentAccount.movements[index];
  Model.state.currentAccount.budget.find(
    (el) => el.name === mov.category
  ).value -= mov.amount;
  Model.state.currentAccount.movements.splice(index, 1);
  document.querySelector(`.movement--row[data-index="${index}"]`).remove();
  overviewView.renderBudget(Model.state.currentAccount.budget);
  saveLocalStorage();
  transactionModal.toggle();
});

document.querySelector(".btn--budget").addEventListener("click", function () {
  modalView.updateModalInfo("budget", Model.state.currentAccount.budget);
  transactionModal.show();
});

function init() {
  Model.loadLocalStorage();
  Model.state.currentAccount.movements.forEach((el, i) =>
    View.renderTransaction(el, i)
  );
  overviewView.renderBudget(Model.state.currentAccount.budget);
}

init();

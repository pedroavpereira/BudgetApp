"use stict";
import * as bootstrap from "bootstrap";

import * as helper from "./bootstrapElements.js";
import * as View from "./Views/movementsView.js";
import * as filterView from "./Views/filterView.js";
import * as overviewView from "./Views/overviewView.js";
import * as modalView from "./Views/modalView.js";
import * as movementsNavView from "./Views/movementsNavView.js";
import * as Model from "./Model.js";

const btnDeleteClicked = (id) => {
  const mov = Model.findTransaction(id);
  Model.updateBudget({ category: mov.category, amount: 0 }, mov);
  Model.deleteTransaction(id);
  View.deleteTransaction(id);
  overviewView.renderBudget(Model.state.currentAccount.budget);
};

const addTransactionClicked = () => {
  modalView.updateModalInfo(
    "transactionNew",
    Model.state.currentAccount.budget
  );
};

const transactionUpdated = (obj) => {
  const mov = Model.findTransaction(obj.id);
  const updatedTransaction = Model.updateTransaction(
    mov,
    obj.amount,
    obj.category
  );

  View.deleteTransaction(obj.id);
  View.renderTransaction(
    updatedTransaction,
    `.movement--row[data-id="${obj.id}"]`
  );
};

const newTransactionCreated = (obj) => {
  const newTransaction = Model.createTransaction(obj.amount, obj.category);
  const index = Model.state.currentAccount.movements.length - 1;
  View.renderTransaction(newTransaction);
};

const budgetSubmited = (obj) => {
  Model.newBudget(obj);
};

const submitButtonClicked = (type, obj) => {
  if (type.startsWith("transaction")) {
    if (type.endsWith("New")) {
      newTransactionCreated(obj);
    } else {
      transactionUpdated(obj);
    }
  } else if (type === "budget") {
    budgetSubmited(obj);
  }

  overviewView.renderBudget(Model.state.currentAccount.budget);
};

const updateBudgetClicked = () => {
  modalView.updateModalInfo("budget", Model.state.currentAccount.budget);
};

const transactionClicked = (id) => {
  const mov = Model.state.currentAccount.movements.find((el) => el.id === id);
  modalView.updateModalInfo(
    "transaction",
    Model.state.currentAccount.budget,
    mov
  );
};

const applyFilterClicked = (obj) => {
  const transactions = Model.filterTransactions({ categories: obj.categories });
  View.renderAllTransactions(transactions);
};

function init() {
  Model.loadLocalStorage();

  View.renderAllTransactions(Model.filterTransactions(Model.filters));
  filterView.renderCheckboxes(Model.state.currentAccount.budget);

  filterView.applyFilterEvent(applyFilterClicked);
  View.movementContainerEvent(transactionClicked);
  modalView.deleteBtnEvent(btnDeleteClicked);
  modalView.submitBtnEvent(submitButtonClicked);
  movementsNavView.addTransactionEvent(addTransactionClicked);
  overviewView.renderBudget(Model.state.currentAccount.budget);
  overviewView.changeBudgetClicked(updateBudgetClicked);
}

init();

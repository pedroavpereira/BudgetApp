"use stict";
import * as bootstrap from "bootstrap";

import * as helper from "./bootstrapElements.js";
import * as View from "./Views/movementsView.js";
import * as filterView from "./Views/filterView.js";
import * as overviewView from "./Views/budgetView.js";
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
  const updatedTransaction = Model.updateTransaction(obj);
  View.deleteTransaction(obj.id);
  View.renderTransaction(
    updatedTransaction,
    `.movement--row[data-id="${obj.id}"]`
  );
};

const newTransactionCreated = (obj) => {
  console.log("newTransaction");
  const newTransaction = Model.createTransaction(obj);
  console.log(newTransaction);
  if (
    (Model.filters.categories.includes(newTransaction.category) ||
      Model.filters.categories.length == 0) &&
    Model.isSameMonth(newTransaction)
  ) {
    Model.updateBudget(newTransaction);
    View.renderTransaction(newTransaction);
  }
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
  const transactions = Model.filterTransactions(obj);
  View.renderAllTransactions(transactions);
  Model.calculateBudget(transactions);
  overviewView.renderBudget(Model.state.currentAccount.budget);
};

const datePickerYearChanged = (yearSelected) => {
  filterView.renderDate(creatingDateObj(yearSelected), false);
};

const creatingDateObj = (yearSelected = new Date().getFullYear()) => {
  const earliestMovDate = Model.filters.earliestDate;
  const dateObj = { earliest: {}, current: {} };
  dateObj.yearSelected = yearSelected;
  dateObj.earliestDate = new Date(earliestMovDate);
  dateObj.earliest.year = dateObj.earliestDate.getFullYear();
  dateObj.earliest.month = dateObj.earliestDate.getMonth();
  dateObj.current.year = new Date().getFullYear();
  dateObj.current.month = new Date().getMonth();
  return dateObj;
};

function init() {
  Model.loadLocalStorage();
  if (Model.state.currentAccount.movements.length > 0) {
    Model.initFilter();
  }
  console.log(Model.state);
  // Model.addMovement();

  filterView.renderDate(creatingDateObj());

  View.renderAllTransactions(Model.filterTransactions());
  filterView.renderCheckboxes(Model.state.currentAccount.budget);
  Model.calculateBudget(Model.filterTransactions());
  overviewView.renderBudget(Model.state.currentAccount.budget);

  filterView.datePickerYearEvent(datePickerYearChanged);
  filterView.applyFilterEvent(applyFilterClicked);
  View.movementContainerEvent(transactionClicked);
  modalView.deleteBtnEvent(btnDeleteClicked);
  modalView.submitBtnEvent(submitButtonClicked);
  movementsNavView.addTransactionEvent(addTransactionClicked);
  overviewView.changeBudgetClicked(updateBudgetClicked);
}

init();

"use stict";
import * as bootstrap from "bootstrap";

import * as helper from "./bootstrapElements.js";
import * as modalBase from "./Views/modal/modalBase.js";
import * as savingsModalView from "./Views/modal/savingsModal.js";
import * as transactionModalView from "./Views/modal/transactionModal.js";
import * as budgetModalView from "./Views/modal/budgetModal.js";
import * as View from "./Views/movementsView.js";
import * as filterView from "./Views/filterView.js";
import * as accountsView from "./Views/accountsView.js";
import * as overviewView from "./Views/overviewView.js";
import * as budgetView from "./Views/budgetView.js";
import * as modalView from "./Views/modalView.js";
import * as movementsNavView from "./Views/movementsNavView.js";
import * as Model from "./Model.js";

const updateOverview = () => {
  Model.modifyStateOverview(Model.filterTransactions());
  overviewView.updateOverview(Model.state.overview);
};

const btnDeleteClicked = (id) => {
  const mov = Model.findTransaction(id);
  Model.updateBudget({ category: mov.category, amount: 0 }, mov);
  Model.updateStateOverview({ type: mov.type, amount: 0 }, mov);
  Model.deleteTransaction(id);
  View.deleteTransaction(id);
  budgetView.renderBudget(Model.state);
  overviewView.updateOverview(Model.state.overview);
};

const addTransactionClicked = () => {
  if (Model.state.currentAccount.type === "Savings") {
    savingsModalView.renderAccountSum(Model.state.currentAccount);
  } else {
    transactionModalView.renderTransactionModal(Model.state);
  }
};

const transactionUpdated = (obj) => {
  const updatedTransaction = Model.updateTransaction(obj);
  View.deleteTransaction(obj.id);
  overviewView.updateOverview(Model.state.overview);
  if (Model.isSameMonth(updatedTransaction)) {
    View.renderTransaction(
      updatedTransaction,
      `.movement--row[data-id="${obj.id}"]`
    );
  } else {
    Model.initFilter(Model.filters.categories);
    filterView.renderDate(creatingDateObj());
  }
};

const newTransactionCreated = (obj) => {
  const newTransaction = Model.createTransaction(obj);
  if (
    (Model.filters.categories.includes(newTransaction.category) ||
      Model.filters.categories.length == 0) &&
    Model.isSameMonth(newTransaction)
  ) {
    Model.updateBudget(newTransaction);
    updateOverview();
    View.renderTransaction(newTransaction);
  } else {
    Model.initFilter(Model.filters.categories);
    filterView.renderDate(creatingDateObj());
  }
};

const budgetSubmited = (obj) => {
  Model.newBudget(obj);
};

const transferCreated = (obj) => {
  const transferObj = Model.createTransfer(obj);
  View.renderTransaction(transferObj);
};

const savingsAccountUpdated = (accObj) => {
  Model.updateSavingsAccount(accObj);
  accountsView.renderAccounts(Model.state.accounts);
};

const updateBudgetClicked = () => {
  budgetModalView.renderUpdateModal(Model.state);
};

const transactionClicked = (id) => {
  const mov = Model.state.currentAccount.movements.find((el) => el.id === id);
  if (Model.state.currentAccount.type === "Savings") {
    savingsModalView.renderTransactionSum(mov);
  } else {
    transactionModalView.renderTransactionModal(Model.state, mov);
  }
};

const applyFilterClicked = (obj) => {
  const transactions = Model.filterTransactions(obj);
  View.renderAllTransactions(transactions);
  Model.modifyStateOverview(transactions);
  overviewView.updateOverview(Model.state.overview);
  Model.calculateBudget(transactions);
  budgetView.renderBudget(Model.state);
};

const datePickerYearChanged = (yearSelected) => {
  filterView.renderDate(creatingDateObj(yearSelected), false);
};

const creatingDateObj = (yearSelected = new Date().getFullYear()) => {
  const earliestMovDate = Model.filters.earliestDate;
  const dateObj = { earliest: {}, current: {}, earliestDate: 0 };
  dateObj.yearSelected = yearSelected;
  dateObj.earliestDate = new Date(earliestMovDate);
  dateObj.earliest.year = dateObj.earliestDate.getFullYear();
  dateObj.earliest.month = dateObj.earliestDate.getMonth();
  dateObj.current.year = new Date().getFullYear();
  dateObj.current.month = new Date().getMonth();
  return dateObj;
};

const submitButtonClicked = (formData) => {
  console.log(formData);
  switch (formData.target) {
    case "newTrans":
      if (formData.type === "Transfer") {
        transferCreated(formData);
      } else {
        newTransactionCreated(formData);
      }
      break;
    case "updateTrans":
      transactionUpdated(formData);
      break;
    case "updateAccount":
      savingsAccountUpdated(formData);
      break;
    case "updateBudget":
      budgetSubmited(formData);
      break;
    default:
      break;
  }
};

const changeAccountClicked = (accId) => {
  Model.changeAccount(accId);
  Model.initFilter();
  View.renderAllTransactions(Model.filterTransactions());
  updateOverview();
  budgetView.renderBudget(Model.state);
  filterView.renderDate(creatingDateObj());
  filterView.uncheckCheckboxes();
};

const createNewAccountClicked = (accObj) => {
  Model.createAccount(accObj);
  accountsView.renderAccounts(Model.state.accounts);
};

const deleteAccountClicked = (accId) => {
  Model.deleteAccount(accId);
  accountsView.renderAccounts(Model.state.accounts);
  View.renderAllTransactions(Model.filterTransactions());
  updateOverview();
};

function init() {
  Model.loadLocalStorage();
  Model.state.currentAccount = Model.state.accounts[0];
  if (Model.state.currentAccount.movements.length > 0) {
    Model.initFilter();
  }
  Model.saveLocalStorage();
  console.log(Model.state);
  // Model.addMovement();

  filterView.renderDate(creatingDateObj());

  View.renderAllTransactions(Model.filterTransactions());
  updateOverview();
  accountsView.renderAccounts(Model.state.accounts);

  filterView.renderCheckboxes(Model.state.budget);
  Model.calculateBudget(Model.filterTransactions());
  budgetView.renderBudget(Model.state);

  accountsView.accountContainerEvent(
    changeAccountClicked,
    createNewAccountClicked,
    deleteAccountClicked
  );
  filterView.datePickerYearEvent(datePickerYearChanged);
  filterView.applyFilterEvent(applyFilterClicked);
  View.movementContainerEvent(transactionClicked);
  modalView.deleteBtnEvent(btnDeleteClicked);
  modalBase.submitFormEvent(submitButtonClicked);
  // modalView.submitBtnEvent(
  //   newTransactionCreated,
  //   transactionUpdated,
  //   budgetSubmited,
  //   transferCreated,
  //   savingsAccountUpdated
  // );
  movementsNavView.addTransactionEvent(addTransactionClicked);
  budgetView.changeBudgetClicked(updateBudgetClicked);
}

init();

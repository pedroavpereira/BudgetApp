"use stict";

import * as Model from "./Model.js";
import * as accountsView from "./Views/accountsView.js";
import * as budgetView from "./Views/budgetView.js";
import * as filterView from "./Views/filterView.js";
import * as datePickerView from "./Views/datePickerView.js"
import * as paginationView from "./Views/paginationView.js"
import * as budgetModalView from "./Views/modal/budgetModal.js";
import * as modalBase from "./Views/modal/modalBase.js";
import * as savingsModalView from "./Views/modal/savingsModal.js";
import * as transactionModalView from "./Views/modal/transactionModal.js";
import * as movementsNavView from "./Views/movementsNavView.js";
import * as View from "./Views/movementsView.js";
import * as overviewView from "./Views/overviewView.js";
import * as alertView from "./Views/alertView.js";

const updateOverview = () => {
  Model.modifyStateOverview(Model.getTransactions(1,true));
  overviewView.updateOverview(Model.state);
};

const btnDeleteClicked = (id) => {
  const mov = Model.findTransaction(id);
  Model.updateBudget({ category: mov.category, amount: 0 }, mov);
  Model.updateStateOverview({ type: mov.type, amount: 0 }, mov);
  Model.deleteTransaction(id);
  View.renderAllTransactions(Model.getTransactions(Model.state.pagination.page));
  paginationView.renderPagination(Model.state.pagination);
  budgetView.renderBudget(Model.state);
  overviewView.updateOverview(Model.state);

};

const addTransactionClicked = () => {
    transactionModalView.renderTransactionModal(Model.state);
};

const transactionUpdated = (obj) => {
  const updatedTransaction = Model.updateTransaction(obj);
  View.deleteTransaction(obj.id);
  overviewView.updateOverview(Model.state);
  if (Model.isSameMonth(updatedTransaction)) {
    View.renderTransaction(
      updatedTransaction,
      `.movement--row[data-id="${obj.id}"]`
    );
  } else {
    Model.initFilter(Model.filters.categories);
    datePickerView.generateYears(creatingDateObj());
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
    View.renderAllTransactions(Model.getTransactions(Model.state.pagination.page));
    paginationView.renderPagination(Model.state.pagination);
  } else {
    Model.initFilter(Model.filters.categories);
    datePickerView.generateYears(creatingDateObj());
  }
};

const budgetSubmited = (obj) => {
  Model.newBudget(obj);
};

const transferCreated = (obj) => {
  const transferObj = Model.createTransfer(obj);
  View.renderTransaction(transferObj);
};



const updateBudgetClicked = () => {
  budgetModalView.renderUpdateModal(Model.state);
};

const transactionClicked = (id) => {
  const mov = Model.state.currentAccount.movements.find((el) => el.id === id);
    transactionModalView.renderTransactionModal(Model.state, mov);
  
};

const applyFilterClicked = (obj) => {
  console.log(obj)
  Model.updateCategoriesFilter(obj)
  const transactions = Model.getTransactions(Model.state.pagination.page);
  View.renderAllTransactions(transactions);
  Model.modifyStateOverview(transactions);
  overviewView.updateOverview(Model.state);
  Model.calculateBudget(transactions);
  budgetView.renderBudget(Model.state);
  paginationView.renderPagination(Model.state.pagination)
};

const datePickerClicked = (newDate) =>{
  Model.updateDateFilter(newDate);
  const transactions = Model.getTransactions()
  Model.modifyStateOverview(transactions);
  overviewView.updateOverview(Model.state);
  Model.calculateBudget(transactions);
  budgetView.renderBudget(Model.state);
  View.renderAllTransactions(Model.getTransactions())
  paginationView.renderPagination(Model.state.pagination)
}


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


const savingsModalEvent = (data) =>{
  console.log(data)
  if(data.type === "withdrawl") {
    savingsWithdrawn(data);
  }else if(data.type==="account"){
    savingsAccountUpdated(data)
  }
}

const savingsAccountUpdated = (accObj) => {
  Model.updateSavingsAccount(accObj);
  accountsView.renderAccounts(Model.state.accounts);
};

const savingsWithdrawn = (formData) => {
  console.log("here")
  const account = Model.findAccount(formData.account);
  const mainAccount = Model.findAccount("native");
  if (Model.hasEnoughFunds(account, formData.amount)) {
    const transferObj = Model.createTransfer({
      amount: formData.amount,
      from: account.name,
      to: mainAccount.name,
    });
    View.renderTransaction(transferObj);
  } else {
    alertView.displayAlert("Insuficient funds in the account", "error");
  }
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
    case "savingsModal":
      savingsModalEvent(formData);
      break;
    case "updateBudget":
      budgetSubmited(formData);
      break;
    case "savingsWithdrawl":
      savingsWithdrawn(formData);
      break;
    default:
      break;
  }
};

const pageChanged = (page) =>{
  View.renderAllTransactions(Model.getTransactions(page));
  paginationView.renderPagination(Model.state.pagination)
}

const accountClicked = (accId) => {
  if(accId === "native") return
  savingsModalView.renderSavingsModal(Model.findAccount(accId));
};

const createNewAccountClicked = (accObj) => {
  Model.createAccount(accObj);
  accountsView.renderAccounts(Model.state.accounts);
};

const deleteAccountClicked = (accId) => {
  Model.deleteAccount(accId);
  accountsView.renderAccounts(Model.state.accounts);
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


  View.renderAllTransactions(Model.getTransactions(1));
  paginationView.renderPagination(Model.state.pagination);
  paginationView.paginationEvent(pageChanged);


  updateOverview();
  accountsView.renderAccounts(Model.state.accounts);

  //Filters and Date init
  filterView.renderCheckboxes(Model.state.budget);
  datePickerView.generateYears(creatingDateObj())
  datePickerView.selectDate(Model.filters.date)


  Model.calculateBudget(Model.filterTransactions());
  budgetView.renderBudget(Model.state);




  accountsView.accountContainerEvent(
    accountClicked,
    createNewAccountClicked,
    deleteAccountClicked
  );

  datePickerView.datePickerEvent(datePickerClicked);
  filterView.applyFilterEvent(applyFilterClicked);
  View.movementContainerEvent(transactionClicked);
  modalBase.deleteBtnEvent(btnDeleteClicked);
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

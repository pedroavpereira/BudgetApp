"use strict";

export let state = {
  overview: { totalIncome: 0, totalExpense: 0 },
  pagination:{page:1,totalPages:1,resultsPerPage:10},
  budget: [
    { type: "Income", name: "Salary", value: 0, target: 0, native: true },
    {
      type: "Income",
      name: "Side hustle",
      value: 0,
      target: 0,
      native: true,
    },
    {
      type: "Income",
      name: "Capital Gains / Dividends",
      value: 0,
      target: 0,
      native: true,
    },
    { type: "Expense", name: "Housing", value: 0, target: 0, native: true },
    {
      type: "Expense",
      name: "Transportation",
      value: 0,
      target: 0,
      native: true,
    },
    { type: "Expense", name: "Groceries", value: 0, target: 0, native: true },
    { type: "Expense", name: "Food", value: 0, target: 0, native: true },
    { type: "Expense", name: "Utilities", value: 0, target: 0, native: true },
    {
      type: "Expense",
      name: "Subscriptions",
      value: 0,
      target: 0,
      native: true,
    },
    { type: "Expense", name: "Savings", value: 0, target: 0, native: true },
    { type: "Expense", name: "Investing", value: 0, target: 0, native: true },
    { type: "Expense", name: "Misc", value: 0, target: 0, native: true },
  ],
  accounts: [
    { name: "Main account", accountID: `native`, movements: [], balance: 0 },
  ],
  currentAccount: {},
};

export let filters = {
  date: Date.now(),
  categories: [],
  earliestDate: Date.now(),
};

export const createTransaction = (obj) => {
  const newTransaction = {
    type: obj.type,
    amount: obj.amount,
    category: obj.category,
    date: obj.date,
    id: String(Date.now()),
  };
  state.currentAccount.movements.push(newTransaction);
  state.currentAccount.balance +=
    newTransaction.type === "Expense"
      ? -newTransaction.amount
      : newTransaction.amount;
  saveLocalStorage();
  return newTransaction;
};

export const updateTransaction = (newMov) => {
  const mov = findTransaction(newMov.id);
  updateBudget(newMov, mov);
  updateStateOverview(newMov, mov);
  state.currentAccount.balance += newMov.amount;
  state.currentAccount.balance -= mov.amount;
  Object.keys(mov).forEach((el) => (mov[el] = newMov[el]));
  saveLocalStorage();
  return mov;
};

export const findTransaction = (id) => {
  return state.currentAccount.movements.find((el) => el.id === id);
};

export const deleteTransaction = (id) => {
  const mov = findTransaction(id);
  state.currentAccount.balance -= mov.amount;
  state.currentAccount.movements.splice(
    state.currentAccount.movements.indexOf(mov),
    1
  );
  saveLocalStorage();
};

export const updateEntireFilters = (filtersObj = { categories: [], date: Date.now() })=>{
  filters.categories = filtersObj.categories;
  filters.date = filtersObj.date;
}

export const updateDateFilter = (newDate) =>{
  filters.date = newDate;
}

export const updateCategoriesFilter = (categoriesArray) =>{
  filters.categories = categoriesArray;
}

export const filterTransactions = () => {
  // filters.categories = obj.categories;
  // filters.date = obj.date;
  let filteredTransactions = state.currentAccount.movements;
 
    filteredTransactions = filteredTransactions.filter((el) => {
      return isSameMonth(el);
    });
    console.log(filteredTransactions);
    filteredTransactions = filteredTransactions.filter((el) =>
      filters.categories.includes(el.category)
    );
    console.log(filteredTransactions);
  return filteredTransactions;
};

export const paginationTransactions = (page,transactions)=>{
  state.pagination.maxPages = Math.ceil(transactions.length / state.pagination.resultsPerPage)
  state.pagination.page = state.pagination.page < state.pagination.maxPages ? page : 1;
  const start = (page-1) * state.pagination.resultsPerPage;
  const end = (page) * state.pagination.resultsPerPage;

  return transactions.sort((a,b)=>a.date-b.date).slice(start,end)
}

export const getTransactions = (page,skip=false) =>{
  if(skip) return filterTransactions(filters);
  return paginationTransactions(page,filterTransactions(filters));
}

export const newBudget = (budgetObj) => {
  state.budget.forEach((el) => {
    el.target = Number(budgetObj[el.name]);
  });
  saveLocalStorage();
};

const resetBudget = () => {
  state.budget.forEach((el) => (el.value = 0));
};

// TODO: Find more efficient manner of calculating budget instead of nested loops
export const calculateBudget = (arr) => {
  resetBudget();
  state.budget.forEach((el) => {
    arr.forEach((arrEl) => {
      if (el.name === arrEl.category) {
        el.value += Math.abs(arrEl.amount);
      }
    });
  });
};

export const updateBudget = (newMov, oldMov) => {
  if (oldMov) {
    const oldCategory = state.budget.find((el) => el.name === oldMov.category);
    const newCategory = state.budget.find((el) => el.name === newMov.category);

    if (newCategory != oldCategory) {
      oldCategory.value -= +oldMov.amount;
      newCategory.value += +newMov.amount;
    } else {
      if (newMov.amount != oldMov.amount) {
        newCategory.value += +newMov.amount - oldMov.amount;
      }
    }

    return;
  }
  state.budget.find((el) => el.name === newMov.category).value +=
    +newMov.amount;
  saveLocalStorage();
  return;
};

export const modifyStateOverview = (arr) => {
  resetStateOverview();
  arr.forEach((el) => {
    state.overview[`total${el.type}`] += el.amount;
  });
  return state.overview;
};

export const updateStateOverview = (newMov, oldMov) => {
  if (oldMov) state.overview[`total${oldMov.type}`] -= oldMov.amount;
  state.overview[`total${newMov.type}`] += newMov.amount;
};

const resetStateOverview = () => {
  state.overview.difference = 0;
  state.overview.totalExpense = 0;
  state.overview.totalIncome = 0;
};

export const createAccount = (accObj) => {
  const newAccount = {
    name: accObj.name,
    type: accObj.type,
    balance: 0,
    movements: [],
    accountID: `${Date.now()}acc`,
  };
  if (accObj.type === "Savings") newAccount.goal = 0;
  if (accObj.type === "Investing") newAccount.currentValue = 0;
  state.accounts.push(newAccount);
  saveLocalStorage();
};

export const updateSavingsAccount = (accObj) => {
  const account = findAccount(accObj.account);
  Object.keys(accObj).forEach((el) => {
    if (account.hasOwnProperty(el)) {
      account[el] = accObj[el];
    }
  });
  saveLocalStorage();
};

export const changeAccount = (accId) => {
  const acc = state.accounts.find((el) => el.accountID === accId);
  state.currentAccount = acc;
};

export const findAccount = (accId) => {
  return state.accounts.find((el) => el.accountID === accId);
};

export const deleteAccount = (accId) => {
  const account = state.accounts.find((el) => el.accountID === accId);
  if (state.currentAccount === account) {
    state.currentAccount = state.accounts.find(
      (el) => el.accountID === "native"
    );
  }
  state.accounts.splice(state.accounts.indexOf(account), 1);
  saveLocalStorage();
};

export const createTransfer = (transferObj) => {
  const transfer = {
    type: "Transfer",
    from: transferObj.from,
    to: transferObj.to,
    amount: transferObj.amount,
    date: Date.now(),
    id: String(Date.now()),
  };
  const fromAccount = state.accounts.find((el) => el.name === transfer.from);
  const toAccount = state.accounts.find((el) => el.name === transfer.to);
  fromAccount.balance -= transfer.amount;
  toAccount.balance += transfer.amount;

  if (fromAccount.name === "native") {
    state.currentAccount.movements.push({ ...transfer, category: "Out" });
  } else {
    state.currentAccount.movements.push({ ...transfer, category: "In" });
  }
  saveLocalStorage();
  return { ...transfer, category: "Out" };
};

export const initFilter = (categories = []) => {
  const newCategories = categories
  
  if(newCategories.length === 0){
    state.budget.forEach(el=>{
      newCategories.push(el.name)
    })
  }


  if (state.currentAccount.movements.length > 0) {
    filters.earliestDate = state.currentAccount.movements.reduce(
      (lowest, el) => {
        return (lowest = el.date < lowest ? el.date : lowest);
      },
      state.currentAccount.movements[0].date
    );
  } else {
    filters.earliestDate = Date.now();
  }

  filters.categories = newCategories;
};

export const hasEnoughFunds = (acc, amount) => {
  return acc.balance >= amount;
};

export const isSameMonth = (mov) => {
  return (
    new Date(filters.date).getMonth() === new Date(mov.date).getMonth() &&
    new Date(filters.date).getFullYear() === new Date(mov.date).getFullYear()
  );
};

export const isSameAccount = (accName) => {
  return accName === state.currentAccount.name;
};

export const loadLocalStorage = () => {
  if (localStorage.getItem("state")) {
    state = JSON.parse(localStorage.getItem("state"));
  }
};

export const saveLocalStorage = () => {
  localStorage.setItem("state", JSON.stringify(state));
};

//Add movement to testing porpuses should not be used and should be deleted before production
export const addMovement = () => {
  const fakeDate = Date.parse(new Date(2021, 8, 12));
  const newMov = {
    date: fakeDate,
    amount: 10,
    category: "Groceries",
    id: String(fakeDate),
  };
  console.log(newMov);
  state.currentAccount.movements.push(newMov);
  saveLocalStorage();
};

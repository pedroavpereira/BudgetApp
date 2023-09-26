"use strict";

export let state = {
  overview: { totalIncome: 0, totalExpense: 0 },
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
  accounts: [{ name: "Main account", accountID: `native`, movements: [] }],
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
  saveLocalStorage();
  return newTransaction;
};

export const updateTransaction = (newMov) => {
  const mov = findTransaction(newMov.id);
  updateBudget(newMov, mov);
  updateStateOverview(newMov, mov);
  Object.keys(mov).forEach((el) => (mov[el] = newMov[el]));
  saveLocalStorage();
  return mov;
};

export const findTransaction = (id) => {
  return state.currentAccount.movements.find((el) => el.id === id);
};
export const deleteTransaction = (id) => {
  const i = state.currentAccount.movements.indexOf(findTransaction(id));
  state.currentAccount.movements.splice(i, 1);
  saveLocalStorage();
};

export const filterTransactions = (
  obj = { categories: [], date: Date.now() }
) => {
  filters.categories = obj.categories;
  filters.date = obj.date;

  let filteredTransactions = state.currentAccount.movements;
  if (obj.date) {
    filteredTransactions = filteredTransactions.filter((el) => {
      return isSameMonth(el);
    });
  }
  if (obj.categories && obj.categories.length != 0) {
    filteredTransactions = filteredTransactions.filter((el) =>
      obj.categories.includes(el.category)
    );
  }
  return filteredTransactions;
};

export const newBudget = (newBudget) => {
  state.budget = newBudget;
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
        el.value += +arrEl.amount;
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

export const createAccount = (accName) => {
  const newAccount = {
    name: accName,
    movements: [],
    accountID: `${Date.now()}acc`,
  };
  state.accounts.push(newAccount);
  saveLocalStorage();
};

export const changeAccount = (accId) => {
  const acc = state.accounts.find((el) => el.accountID === accId);
  state.currentAccount = acc;
};

export const initFilter = (categories = []) => {
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

  filters.categories = categories;
};

export const isSameMonth = (mov) => {
  return (
    new Date(filters.date).getMonth() === new Date(mov.date).getMonth() &&
    new Date(filters.date).getFullYear() === new Date(mov.date).getFullYear()
  );
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

"use strict";

export let state = {
  currentAccount: {
    movements: [],
    budget: [
      { name: "Housing", value: 0, target: 0, native: true },
      { name: "Transportation", value: 0, target: 0, native: true },
      { name: "Groceries", value: 0, target: 0, native: true },
      { name: "Food", value: 0, target: 0, native: true },
      { name: "Utilities", value: 0, target: 0, native: true },
      { name: "Subscriptions", value: 0, target: 0, native: true },
      { name: "Savings", value: 0, target: 0, native: true },
      { name: "Investing", value: 0, target: 0, native: true },
      { name: "Misc", value: 0, target: 0, native: true },
    ],
  },
};

export let filters = { date: Date.now(), categories: [] };

export const createTransaction = (amount, category) => {
  const date = new Date().toLocaleDateString("pt-pt", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const newTransaction = { amount, category, date, id: String(Date.now()) };
  state.currentAccount.budget.find((el) => el.name === category).value +=
    +amount;
  state.currentAccount.movements.push(newTransaction);
  saveLocalStorage();
  return newTransaction;
};

export const updateTransaction = (mov, amount, category) => {
  const newMov = { amount, category, date: mov.date };
  updateBudget(newMov, mov);
  mov.category = category;
  mov.amount = amount;
  saveLocalStorage();
  return mov;
};

export const newBudget = (newBudget) => {
  state.currentAccount.budget = newBudget;
  saveLocalStorage();
};

export const updateBudget = (newMov, oldMov) => {
  if (oldMov) {
    const oldCategory = state.currentAccount.budget.find(
      (el) => el.name === oldMov.category
    );
    const newCategory = state.currentAccount.budget.find(
      (el) => el.name === newMov.category
    );

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
  state.currentAccount.budget.find((el) => el.name === newMov.category).value +=
    +mov.amount;
  saveLocalStorage();
  return;
};

export const findTransaction = (id) => {
  return state.currentAccount.movements.find((el) => el.id === id);
};
export const deleteTransaction = (id) => {
  const i = state.currentAccount.movements.indexOf(findTransaction(id));
  state.currentAccount.movements.splice(i, 1);
  saveLocalStorage();
};

export const filterTransactions = (obj) => {
  filters.categories = obj.categories;
  let filteredTransactions = state.currentAccount.movements;
  if (obj.date) {
    return;
  }
  if (obj.categories && obj.categories.length != 0) {
    filteredTransactions = filteredTransactions.filter((el) =>
      obj.categories.includes(el.category)
    );
  }
  return filteredTransactions;
};

export const loadLocalStorage = () => {
  if (localStorage.getItem("state")) {
    state = JSON.parse(localStorage.getItem("state"));
  }
};

export const saveLocalStorage = () => {
  localStorage.setItem("state", JSON.stringify(state));
};

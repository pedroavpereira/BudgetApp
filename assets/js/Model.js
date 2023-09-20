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

export const createTransaction = (amount, category) => {
  const date = new Date().toLocaleDateString("pt-pt", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const newTransaction = { amount, category, date };
  state.currentAccount.budget.find((el) => el.name === category).value +=
    +amount;
  state.currentAccount.movements.push(newTransaction);

  return newTransaction;
};

export const updateTransaction = (mov, amount, category) => {
  const newMov = { amount, category, date: mov.date };
  updateBudget(newMov, mov);
  mov.category = category;
  mov.amount = amount;

  return mov;
};

export const updateBudget = (newMov, oldMov) => {
  if (oldMov) {
    const oldCategory = state.currentAccount.budget.find(
      (el) => el.name === oldMov.category
    );
    const newCategory = state.currentAccount.budget.find(
      (el) => el.name === newMov.category
    );

    console.log(oldCategory, newCategory);

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
  return;
};

export const loadLocalStorage = () => {
  if (localStorage.getItem("state")) {
    state = JSON.parse(localStorage.getItem("state"));
  }
};

"use stict";
import * as bootstrap from "bootstrap";

const modal = document.querySelector("#addTransactionModal");
const transactionModal = new bootstrap.Modal(modal);

const btnSubmitModal = document.querySelector(".btn--submitModal");
const btnDeleteTrans = document.querySelector(".btn--deleteTransaction");

let state = {
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

const saveLocalStorage = () => {
  localStorage.setItem("state", JSON.stringify(state));
};

const createTransaction = (amount, category) => {
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

const updateTransaction = (mov, amount, category) => {
  if (mov.category != category) {
    state.currentAccount.budget.find((el) => el.name === mov.category).value -=
      +mov.amount;
    state.currentAccount.budget.find((el) => el.name === category).value +=
      +amount;
  }
  if (mov.amount != amount) {
    state.currentAccount.budget.find((el) => el.name === mov.category).value +=
      +amount - mov.amount;
  }
  mov.category = category;
  mov.amount = amount;

  return mov;
};

const renderTransaction = (mov, selectorDOM = ".movement--container") => {
  const markup = `<div class="movement--row" data-index="${state.currentAccount.movements.indexOf(
    mov
  )}">
  <div class="row text-center" >
  <div class="col-6 col-md-4 p-3">${mov.date}</div>
  <div class="col-4 p-3 d-none d-md-block">${mov.category}</div>
  <div class="col-6 col-md-4 p-3">${mov.amount}</div>
</div>
</div>`;

  document.querySelector(selectorDOM).insertAdjacentHTML("afterbegin", markup);
};

const updateModalInfo = (
  type,
  mov = { category: "Housing", amount: "", date: "null" }
) => {
  const index = type.endsWith("New")
    ? "new"
    : state.currentAccount.movements.indexOf(mov);

  modal.setAttribute("data-index", index);
  modal.setAttribute("data-type", type);

  let markup;

  if (type === "budget") {
    markup = `<div class="col">
    ${state.currentAccount.budget
      .map((el) => {
        return `
    <div class="col my-2">
    <label for="cat${el.name}">${el.name}: </label>
    <input class="input--budget" data-category=${el.name} type="number" id="cat${el.name}" value="${el.target}" />
  </div>
    </div>`;
      })
      .join(" ")}`;
  } else {
    markup = `<div class="col">
    <div class="form-check">
    ${state.currentAccount.budget
      .map((el) => {
        return `<div class="form-check">
        <input
      class="form-check-input radioTransModal"
      type="radio"
      name="radioCategory"
      id="cat${el.name}"
      ${mov.category === el.name ? "checked" : ""}
      data-category="${el.name}"
    />
    <label class="form-check-label" for="cat${el.name}">
    ${el.name}
    </label>
    </div>`;
      })
      .join(" ")}
      
  <div class="col my-2">
    <label for="newTransactionAmount">Amount: </label>
    <input type="number" id="newTransactionAmount" value="${mov.amount}" />
  </div>
  </div>
  </div>
    `;
  }

  document.querySelector(".modalContent").innerHTML = "";

  document
    .querySelector(".modalContent")
    .insertAdjacentHTML("afterbegin", markup);

  // document.querySelector(".modal-title").textContent = header;
  // document.querySelector(`#cat${values[0]}`).checked = true;
  // document.querySelector("#newTransactionAmount").value = values[1];

  if (index === "null") {
    document.querySelector(".btn--deleteTransaction").classList.add("d-none");
  } else {
    document
      .querySelector(".btn--deleteTransaction")
      .classList.remove("d-none");
  }
};

const updateBudgetObj = (arr) => {};

const renderBudget = () => {
  const markup = state.currentAccount.budget
    .map((el) => {
      return `<p class="text-${el.value <= el.target ? "success" : "danger"}">${
        el.name
      } - ${el.value} / ${el.target}</p>`;
    })
    .join(" ");

  document.querySelector(".overview--body").innerHTML = "";
  document
    .querySelector(".overview--body")
    .insertAdjacentHTML("beforeend", markup);
};

btnSubmitModal.addEventListener("click", function (e) {
  const index = modal.dataset.index;
  const type = modal.dataset.type;

  if (type.startsWith("transaction")) {
    const amount = document.querySelector("#newTransactionAmount")?.value;
    const category = document.querySelector(".radioTransModal:checked")?.dataset
      .category;
    if (!amount || !category) return;

    if (index === "new") {
      const newTransaction = createTransaction(+amount, category);
      renderTransaction(newTransaction);
    } else {
      const updatedTransaction = updateTransaction(
        state.currentAccount.movements[index],
        amount,
        category
      );
      document.querySelector(
        `.movement--row[data-index="${index}"]`
      ).innerHTML = "";
      renderTransaction(
        updatedTransaction,
        `.movement--row[data-index="${index}"]`
      );
    }
    document.querySelector("#newTransactionAmount").value = "";
  } else if (type === "budget") {
    console.log(document.querySelectorAll(".input--budget"));
    const newBudget = [...document.querySelectorAll(".input--budget")].map(
      (el) => {
        return { name: el.dataset.category, target: Number(el.value) };
      }
    );
    newBudget.forEach((el) => {
      const newBudgetEl = state.currentAccount.budget.find(
        (budgetEl) => budgetEl.name === el.name
      );
      console.log(el);
      console.log(newBudgetEl);
      newBudgetEl.target = el.target;
    });

    console.log(state.currentAccount.budget);
  }

  renderBudget();
  saveLocalStorage();
});

document
  .querySelector(".movement--container")
  .addEventListener("click", function (e) {
    const target = e.target.closest(".movement--row");
    if (!target) return;

    const mov = state.currentAccount.movements[target.dataset.index];
    updateModalInfo("transaction", mov);
    modal.setAttribute("data-index", target.dataset.index);
    transactionModal.show();
  });

document
  .querySelector(".btn--addTransaction")
  .addEventListener("click", function () {
    updateModalInfo("transactionNew");
    transactionModal.show();
  });

btnDeleteTrans.addEventListener("click", function () {
  const index = modal.dataset.index;
  const mov = state.currentAccount.movements[modal.dataset.index];
  state.currentAccount.budget.find((el) => el.name === mov.category).value -=
    mov.amount;
  state.currentAccount.movements.splice(index, 1);
  document.querySelector(`.movement--row[data-index="${index}"]`).remove();
  renderBudget();
  saveLocalStorage();
});

document.querySelector(".btn--budget").addEventListener("click", function () {
  updateModalInfo("budget");
  transactionModal.show();
});

(function init() {
  if (localStorage.getItem("state")) {
    state = JSON.parse(localStorage.getItem("state"));

    state.currentAccount.movements.forEach((el, i) => renderTransaction(el));
  }
  renderBudget();
})();

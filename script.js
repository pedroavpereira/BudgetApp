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
      { name: "Housing", value: 0, native: true },
      { name: "Transportation", value: 0, native: true },
      { name: "Groceries", value: 0, native: true },
      { name: "Food", value: 0, native: true },
      { name: "Utilities", value: 0, native: true },
      { name: "Subscriptions", value: 0, native: true },
      { name: "Savings / Investing", value: 0, native: true },
      { name: "Misc", value: 0, native: true },
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
  state.currentAccount.movements.push(newTransaction);
  return newTransaction;
};

const updateTransaction = (mov, amount, category) => {
  mov.amount = amount;
  mov.category = category;
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
  mov = { category: "Housing", amount: 0, date: "null" }
) => {
  const index =
    mov.date == "null" ? "null" : state.currentAccount.movements.indexOf(mov);

  modal.setAttribute("data-index", index);

  const markup = `<div class="col">
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
  document.querySelector(".modalContent").innerHTML = "";

  document
    .querySelector(".modalContent")
    .insertAdjacentHTML("afterbegin", markup);

  // document.querySelector(".modal-title").textContent = header;
  // document.querySelector(`#cat${values[0]}`).checked = true;
  // document.querySelector("#newTransactionAmount").value = values[1];

  // if (type === "new") {
  //   document.querySelector(".btn--deleteTransaction").classList.add("d-none");
  // } else {
  //   document
  //     .querySelector(".btn--deleteTransaction")
  //     .classList.remove("d-none");
  // }
};

btnSubmitModal.addEventListener("click", function (e) {
  const amount = document.querySelector("#newTransactionAmount").value;
  const category = document.querySelector(".radioTransModal:checked").dataset
    .category;
  console.log(category);

  if (!amount || !category) return;

  const index = modal.dataset.index;
  if (index === "null") {
    const newTransaction = createTransaction(amount, category);
    renderTransaction(newTransaction);
  } else {
    const newTransaction = updateTransaction(
      state.currentAccount.movements[index],
      amount,
      category
    );
    document.querySelector(`.movement--row[data-index="${index}"]`).innerHTML =
      "";
    renderTransaction(newTransaction, `.movement--row[data-index="${index}"]`);
  }

  document.querySelector("#newTransactionAmount").value = "";

  saveLocalStorage();
});

document
  .querySelector(".movement--container")
  .addEventListener("click", function (e) {
    const target = e.target.closest(".movement--row");
    if (!target) return;

    const mov = state.currentAccount.movements[target.dataset.index];
    updateModalInfo(mov);
    modal.setAttribute("data-index", target.dataset.index);
    transactionModal.show();
  });

document
  .querySelector(".btn--addTransaction")
  .addEventListener("click", function () {
    updateModalInfo();
    transactionModal.show();
  });

btnDeleteTrans.addEventListener("click", function () {
  const index = modal.dataset.index;
  state.currentAccount.movements.splice(index, 1);
  document.querySelector(`.movement--row[data-index="${index}"]`).remove();
  saveLocalStorage();
});

(function () {
  if (localStorage.getItem("state")) {
    state = JSON.parse(localStorage.getItem("state"));

    state.currentAccount.movements.forEach((el, i) => renderTransaction(el));
  }
})();

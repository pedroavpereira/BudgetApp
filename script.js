"use stict";
import * as bootstrap from "bootstrap";

const modal = document.querySelector("#addTransactionModal");
const transactionModal = new bootstrap.Modal(modal);

const btnSubmitModal = document.querySelector(".btn--submitModal");
const btnDeleteTrans = document.querySelector(".btn--deleteTransaction");

let state = { currentAccount: { movements: [] } };

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
  header = "Add new transaction",
  values = ["", ""],
  type = "new",
  index = null
) => {
  modal.setAttribute("data-index", index);
  document.querySelector(".modal-title").textContent = header;
  document.querySelector("#newTransactionCategory").value = values[0];
  document.querySelector("#newTransactionAmount").value = values[1];
  if (type === "new") {
    document.querySelector(".btn--deleteTransaction").classList.add("d-none");
  } else {
    document
      .querySelector(".btn--deleteTransaction")
      .classList.remove("d-none");
  }
};

btnSubmitModal.addEventListener("click", function (e) {
  const amount = document.querySelector("#newTransactionAmount").value;
  const category = document.querySelector("#newTransactionCategory").value;

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
  document.querySelector("#newTransactionCategory").value = "";

  saveLocalStorage();
});

document
  .querySelector(".movement--container")
  .addEventListener("click", function (e) {
    const target = e.target.closest(".movement--row");
    if (!target) return;

    const mov = state.currentAccount.movements[target.dataset.index];
    updateModalInfo(
      `Transaction in ${mov.date}`,
      [mov.category, mov.amount],
      "edit"
    );
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

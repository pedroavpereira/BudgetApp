"use stict";

const btnSubmitModal = document.querySelector(".submitModal");
let state = { currentAccount: { movements: [] } };

const saveLocalStorage = () => {
  localStorage.setItem("state", JSON.stringify(state));
};

const addNewTransactionView = (mov) => {
  const markup = `<div class="row text-center" data-index="${state.currentAccount.movements.indexOf(
    mov
  )}">
  <div class="col-6 col-md-4 p-3">${mov.date}</div>
  <div class="col-4 p-3 d-none d-md-block">${mov.category}</div>
  <div class="col-6 col-md-4 p-3">${mov.amount}</div>
</div>`;

  document
    .querySelector(".movement--container")
    .insertAdjacentHTML("afterbegin", markup);
};

btnSubmitModal.addEventListener("click", function (e) {
  const amount = document.querySelector("#newTransactionAmount").value;
  const category = document.querySelector("#newTransactionCategory").value;

  document.querySelector("#newTransactionAmount").value = "";
  document.querySelector("#newTransactionCategory").value = "";

  const newTransaction = { amount, category, date: new Date() };
  state.currentAccount.movements.push(newTransaction);
  saveLocalStorage();
  addNewTransactionView(newTransaction);
});

(function () {
  if (localStorage.getItem("state")) {
    state = JSON.parse(localStorage.getItem("state"));

    state.currentAccount.movements.forEach((el, i) =>
      addNewTransactionView(el)
    );
  }
})();

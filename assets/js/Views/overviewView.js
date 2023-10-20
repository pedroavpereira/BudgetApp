const overviewParentElement = document.querySelector(".overviewContainer");
const balanceElement = document.querySelector(".overview__balance");

const generateMarkup = (obj) => {
  const difference = obj.totalIncome - obj.totalExpense;
  return `<p class="${
    obj.totalExpense === 0 && obj.totalIncome === 0 ? "d-none" : ""
  }">
  Income
  <span class="text-success">${obj.totalIncome}</span>
  Expenses
  <span class="text-danger">${obj.totalExpense}</span>
  <span class="text-${
    difference > 0 ? "success" : "danger"
  }">(${difference})</span>
</p>`;
};

export const updateOverview = (obj) => {
  balanceElement.textContent = `${obj.currentAccount.balance}£`;
  overviewParentElement.innerHTML = "";
  overviewParentElement.insertAdjacentHTML(
    "afterbegin",
    generateMarkup(obj.overview)
  );
};

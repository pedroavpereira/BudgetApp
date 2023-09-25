const parentElement = document.querySelector(".overviewContainer");

const generateMarkup = (obj) => {
  const difference = obj.totalIncome - obj.totalExpense;
  return `<p>
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
  parentElement.innerHTML = "";
  parentElement.insertAdjacentHTML("afterbegin", generateMarkup(obj));
};

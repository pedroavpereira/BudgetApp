import * as modalBase from "./modalBase.js";

let data;

const generateTransactionModal = (markup) => {
  return `<div class="modal__i">
  <form action="">
    <div class="modal-header__i">
      <h1 class="modal-tittle__i">Update Budget</h1>
      <span class="modal-close__i">&#10060</span>
    </div>
    <div class="modal-content__i">
      ${markup}
    </div>
    <div class="modal-footer__i">
      <button type="button" class="btn modal-btn modal-btn__cancel">
        Close
      </button>
      <button type="submit" class="btn modal-btn modal-btn__submit">
        Update
      </button>
    </div>
  </form>
</div>
<div class="overlay__i"></div>`;
};

const generateBudgetMarkup = (budget) => {
  return `<div class="col">
    ${budget
      .map((el) => {
        return `
    <div class="col my-2">
    <label for="cat${el.name}">${el.name}: </label>
    <input class="input--budget" data-category=${el.name} name="${el.name}" data-native="${el.native}" data-value="${el.value}" type="number" id="cat${el.name}" value="${el.target}" />
  </div>`;
      })
      .join(" ")}
      </div>`;
};

export const renderUpdateModal = (stateObj, handleUpdateBudget) => {
  const markup = generateBudgetMarkup(stateObj.budget);
  const modalMarkup = generateTransactionModal(markup);
  modalBase.insertModal(modalMarkup);
  modalBase.addClosingEventListeners([".modal-btn__cancel"]);

  document
    .querySelector(".modal__i form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const dataArr = [...formData].map((el) => {
        [el[0], Number(el[1])];
      });
      const data = Object.fromEntries(dataArr);
      console.log(data);
    });
};

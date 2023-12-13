import * as modalBase from "../modalBase.js";
import * as sharedTransactionModalLogic from "./sharedTransactionModalLogic.js";

let currentTransaction;

const generateTransactionModal = (markup) => {
  return `<div class="modal__i">
  <form action="">
    <div class="modal-header__i">
      <h1 class="modal-tittle__i">Transaction : ${currentTransaction.id}</h1>
      <span class="modal-close__i">&#10060</span>
    </div>
    <div class="modal-content__i">
      ${markup}
    </div>
    <div class="modal-footer__i">
      <button type="button" class="btn modal-btn modal-btn__cancel">
        Delete
      </button>
      <button type="submit" class="btn modal-btn modal-btn__submit">
        Update
      </button>
    </div>
  </form>
</div>
<div class="overlay__i"></div>`;
};

const movFillInputs = (mov) => {
  document.getElementById(`transaction-type--${mov.type}`).checked = true;
  document.getElementById(`modal-cat--${mov.category}`).checked = true;

  document.querySelector(`#newTransactionAmount`).value = Math.abs(mov.amount);
  const date = new Date(mov.date);
  document.querySelector("#getDayModal").value = date.getDate();
  document.querySelector(`#getMonthModal`).value =
    config.months[date.getMonth()];
  document.querySelector("#getYearModal").value = date.getFullYear();
};

export const renderTransactionModal = (
  stateObj,
  mov,
  handleUpdateTransaction,
  handleDeleteTransaction,
  errorAlertHandler
) => {
  currentTransaction = mov;
  const contentmarkup = sharedTransactionModalLogic.generateContent(
    stateObj,
    mov.type
  );
  const modalMarkup = generateTransactionModal(contentmarkup);
  modalBase.insertModal(modalMarkup);
  // document.querySelector("body").insertAdjacentHTML("beforeend", modalMarkup);
  modalBase.addClosingEventListeners();

  document
    .querySelector(".modal-btn__cancel")
    .addEventListener("click", function () {
      console.log("Cliiicked");
      handleDeleteTransaction(currentTransaction.id);
      errorAlertHandler("Transaction deleted successfully", "success", 4000);
      modalBase.destroyModal();
    });

  document
    .querySelector(".modal__i form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const dataArr = [...formData];
      const data = Object.fromEntries(dataArr);

      const validatedForm = sharedTransactionModalLogic.formValidatedData(data);

      if (!validatedForm) {
        errorAlertHandler(
          "Form filled incorrectly, Please double check every field",
          "error",
          4000
        );
        return;
      }
      validatedForm.id = currentTransaction.id;

      handleUpdateTransaction(validatedForm);
      errorAlertHandler("Transaction updated successfully", "success", 4000);
      modalBase.destroyModal();
    });
  // modalBase.updateBaseModal(createOptionsObj(mov));
  // modalBase.insertHTML(markup);
  // modalBase.transactionModal.show();
  // if (mov) movFillInputs(mov);
};

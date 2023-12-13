import * as modalBase from "./../modalBase.js";
import * as sharedTransactionModalLogic from "./sharedTransactionModalLogic.js";

const generateNewTransactionModal = (markup) => {
  return `<div class="modal__i">
    <form action="">
      <div class="modal-header__i">
        <h1 class="modal-tittle__i">New Transaction</h1>
        <span class="modal-close__i">&#10060</span>
      </div>
      <div class="modal-content__i">
        ${markup}
      </div>
      <div class="modal-footer__i">
        <button type="button" class="btn modal-btn modal-btn__cancel">
          Cancel
        </button>
        <button type="submit" class="btn modal-btn modal-btn__submit">
          Update
        </button>
      </div>
    </form>
  </div>
  <div class="overlay__i"></div>`;
};

export default (stateObj, newTransactionHandler, errorAlertHandler) => {
  const contentmarkup = sharedTransactionModalLogic.generateContent(stateObj);
  const modalMarkup = generateNewTransactionModal(contentmarkup);
  document.querySelector("body").insertAdjacentHTML("beforeend", modalMarkup);
  modalBase.addClosingEventListeners([".modal-btn__cancel"]);

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
      errorAlertHandler("Transaction created successfully", "success", 4000);
      newTransactionHandler(validatedForm);
      modalBase.destroyModal();
    });
};

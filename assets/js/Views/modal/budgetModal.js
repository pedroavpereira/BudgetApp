// import * as parentView from "./modalBase.js";

const generateBudgetMarkup = (stateObj) => {
  return `<div class="col">
    ${stateObj.budget
      .map((el) => {
        return `
    <div class="col my-2">
    <label for="cat${el.name}">${el.name}: </label>
    <input class="input--budget" data-category=${el.name} name="${el.name}" data-native="${el.native}" data-value="${el.value}" type="number" id="cat${el.name}" value="${el.target}" />
  </div>
    </div>`;
      })
      .join(" ")}`;
};

export const renderUpdateModal = (stateObj) => {
  const markup = generateBudgetMarkup(stateObj);
  parentView.updateBaseModal({
    title: "Change budget",
    submitBtn: ["Update", "updateBudget"],
  });
  parentView.insertHTML(markup);
};

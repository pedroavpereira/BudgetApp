const parentElement = document.querySelector(".dropdown-menu--content");

const generateMarkup = (el) => {
  return `<li class="dropdown-item">
    <input type="checkbox" class="dropdown--category" id="cat${el.name}" data-category="${el.name}"/>
    <label for="cat${el.name}">${el.name}</label>
  </li>`;
};

export const renderCheckboxes = (obj) => {
  const markup = obj.map((el) => generateMarkup(el)).join("");

  parentElement.insertAdjacentHTML("afterbegin", markup);
};

export const applyFilterEvent = (handler) => {
  document
    .querySelector(".dropdown-menu")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("btn")) {
        const obj = {};
        obj.categories = [
          ...document.querySelectorAll(".dropdown--category:checked"),
        ].map((el) => el.dataset.category);
        handler(obj);
      } else {
        e.stopPropagation();
      }
    });
};

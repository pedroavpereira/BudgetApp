const parentElement = document.querySelector(".dropdown-menu--category");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const uncheckCheckboxes = () => {
  [...document.querySelectorAll(".dropdown--category")].forEach(
    (el) => (el.checked = false)
  );
};

const generateMarkupCheckbox = (el) => {
  return `<li class="dropdown-item">
    <input type="checkbox" class="dropdown--category" id="cat${el.name}" data-category="${el.name}" checked/>
    <label for="cat${el.name}">${el.name}</label>
  </li>`;
};

export const renderCheckboxes = (obj) => {
  const markup = obj.map((el) => generateMarkupCheckbox(el)).join("");

  parentElement.insertAdjacentHTML("afterbegin", markup);
};

export const datePickerYearEvent = (handler) => {
  document.querySelector("#selectYear").addEventListener("change", function () {
    handler(+this.value);
  });
};

export const applyFilterEvent = (handler) => {
  document
    .querySelector(".dropdown-menu")
    .addEventListener("click", function (e) {
      ;
      if (e.target.classList.contains("btn")) {
        if (e.target.dataset.target === "apply") {
        } else if (e.target.dataset.target === "clear") {
          [...document.querySelectorAll(".dropdown--category")].forEach(
            (el) => (el.checked = true)
          );
        }

        const categoriesArr = [
          ...document.querySelectorAll(".dropdown--category:checked"),
        ].map((el) => el.dataset.category);
        handler(categoriesArr);
      } else {
        e.stopPropagation();
      }
    });
};

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

const generateMarkupMonth = (i) => {
  return `<option data-monthId="${i}" value="${months[i]}">${months[i]}</option>`;
};

const generateMarkupYear = (year) => {
  return `<option value="${year}">${year}</option>`;
};

export const renderDate = (obj, init = true) => {
  if (init) {
    renderYear(obj);
  }
  renderMonths(obj);
};

export const renderYear = (obj) => {
  const yearElement = document.querySelector("#selectYear");
  yearElement.innerHTML = "";

  let year = obj.earliest.year;

  while (year <= new Date().getFullYear()) {
    const markup = generateMarkupYear(year);
    yearElement.insertAdjacentHTML("afterbegin", markup);
    year++;
  }
  if (obj.yearSelected === obj.current.year)
    yearElement.value = obj.current.year;
};

const renderMonths = (obj) => {
  const monthElement = document.querySelector("#selectMonth");
  monthElement.innerHTML = "";
  if (obj.yearSelected === obj.current.year) {
    for (let i = 0; i <= obj.current.month; i++) {
      const markup = generateMarkupMonth(i);
      monthElement.insertAdjacentHTML("beforeend", markup);
    }
    monthElement.value = months[obj.current.month];
  } else if (obj.yearSelected === obj.earliest.year) {
    for (let i = 11; i >= obj.earliest.month; i--) {
      const markup = generateMarkupMonth(i);
      monthElement.insertAdjacentHTML("afterbegin", markup);
    }
    monthElement.value = months[obj.earliest.month];
  } else {
    months.forEach((el, i) => {
      const markup = generateMarkupMonth(i);
      monthElement.insertAdjacentHTML("beforeend", markup);
    });
    monthElement.value = months[0];
  }
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
      if (e.target.classList.contains("btn")) {
        const obj = {};
        if (e.target.dataset.target === "apply") {
          const month = document.querySelector("#selectMonth").value;
          const year = document.querySelector("#selectYear").value;
          obj.date = Date.parse(`01 ${month} ${year}`);
          obj.categories = [
            ...document.querySelectorAll(".dropdown--category:checked"),
          ].map((el) => el.dataset.category);
        } else if (e.target.dataset.target === "clear") {
          [...document.querySelectorAll(".dropdown--category:checked")].forEach(
            (el) => (el.checked = false)
          );
          obj.date = Date.now();
          obj.categories = [];
        }
        handler(obj);
      } else {
        e.stopPropagation();
      }
    });
};

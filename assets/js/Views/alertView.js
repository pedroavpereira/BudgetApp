const generateMarkup = (message, type) => {
  return `<div class="alert-container alert-${type}">
  <p class="alert-message">${message}</p>
</div>`;
};

export const displayAlert = (message, type) => {
  const markup = generateMarkup(message, type);

  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  setTimeout(function () {
    document.querySelector(".alert-container").remove();
  }, 1000);
};

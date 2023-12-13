const ALERT_TIMEOUT_MILISECONDS = 2000;

const generateMarkup = (message, type) => {
  return `<div class="alert-container alert-${type}">
  <p class="alert-message">${message}</p>
</div>`;
};

export const displayAlert = (
  message,
  type,
  timeout = ALERT_TIMEOUT_MILISECONDS
) => {
  const markup = generateMarkup(message, type);

  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  setTimeout(function () {
    document.querySelector(".alert-container").remove();
  }, timeout);
};

/**
 * removes `prev` class and adds `next` class to `elem`
 */
export const swapClasses = ({ elem, prev, next }) => {
  elem.classList.remove(prev);
  elem.classList.add(next);
  return elem;
};

/**
 * logger utils
 */

/**
 * log to console and append to elem with id="logs" if present
 */
const log = (message) => {
  const elem = document.getElementById('logs');
  if (elem) {
    elem.innerHTML += `<p>${message}</p>`;
  }
  console.log(message);
};

/**
 * log error to console and append to elem with id="errors" if present
 */
const error = (err) => {
  const elem = document.getElementById('errors');
  if (elem) {
    elem.innerHTML += `<p>${err}</p>`;
  }
  console.error(err);
};

export const logger = { log, error };

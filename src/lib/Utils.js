/**
 * Convert a string into a slug
 * Source: https://www.linkedin.com/learning/javascript-code-challenges/urlify
 */
export const getSlug = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/[?,.;:!/\\+=´`'"]/g, '')
    .replace(/\s/g, '-');

/**
 * Convert an array into a paged object
 * Source: PGM2 opdracht 2
 * Author: Philippe De Pauw - Waterschoot
 */
export const arrToPagedObj = (arr, itemsPerPage = 10, currentPage = 1) => ({
  pageing: {
    itemsPerPage: parseInt(itemsPerPage, 10),
    currentPage: parseInt(currentPage, 10),
    totalPages: Math.ceil(arr.length / itemsPerPage),
    totalItems: arr.length,
    nextPage:
      currentPage < Math.ceil(arr.length / itemsPerPage)
        ? currentPage + 1
        : false,
    previousPage: currentPage !== 1 ? currentPage - 1 : false,
  },
  items: arr.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  ),
});

/**
 * Check if a value is on object
 * Source: https://www.w3docs.com/snippets/javascript/how-to-check-if-a-value-is-an-object-in-javascript.html
 */
export const isObject = (objValue) =>
  objValue && typeof objValue === 'object' && objValue.constructor === Object;

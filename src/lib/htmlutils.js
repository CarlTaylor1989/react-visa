export const lib = {};

/**
 * Clean up a string with browsers html decoding.
 * Grabbed from stackoverflow
 * @see {@link http://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it}
 * @param {string} html The html to decode.
 * @return {string}
 */
export const decodeHtml = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};
lib.decodeHtml = decodeHtml;

/**
 * Remove markup from text
 * @param {string} text
 * @return {string}
 */
export const removeMarkup = text => text.replace(/<[^>]*>/g, '');
lib.removeMarkup = removeMarkup;

/**
 * Format text and decode it to remove any markup and html.
 * @param {string} text
 * @return {string}
 */
export const cleanupText = (text) => {
  let formatted = text;
  formatted = lib.decodeHtml(formatted);
  formatted = lib.removeMarkup(formatted);
  return formatted;
};
lib.cleanupText = cleanupText;

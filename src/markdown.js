/**
 * Returns a markdown image based on the inputs
 * @param {string} alt - Alternative text
 * @param {string} imagePath - Path for image
 * @returns {string} Markdown image
 */
function image(alt, imagePath) {
  if (imagePath && imagePath.length > 0) {
    return `![${alt}](${imagePath})`;
  }
  return null;
}

/**
 * Returns a markdown link based on the inputs
 * @param {string} text - Link text
 * @param {string} path - Resouce path (href)
 * @returns {string} Markdown link
 */
function link(text, path) {
  if (path && path.length > 0) {
    return `[${text}](${path})`;
  }

  return null;
}

module.exports = {
  image,
  link,
};

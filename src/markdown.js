module.exports = {
  image: image,
  link: link,
};

function image(alt, imagePath) {
  if (imagePath && imagePath.length > 0) {
    return "![" + alt + "](" + imagePath + ")";
  }
  return null;
}

function link(text, path) {
  if (path && path.length > 0) {
    return "[" + text + "](" + path + ")";
  }

  return null;
}

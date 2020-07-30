let assert = require("assert");
const markdown = require("../../src/markdown");

describe("markdown", function () {
  describe("image()", function () {
    it("should create a markdown image with alternative text and a path", () => {
      assert.equal(
        markdown.image("image 1", "/img/1.png"),
        "![image 1](/img/1.png)"
      );
      assert.equal(markdown.image("", "/img/1.png"), "![](/img/1.png)");
    });
    it("should return null if a blank path is give", () => {
      assert.equal(markdown.image("", ""), null);
    });
  });

  describe("link()", function () {
    it("should create a link with text and a path", () => {
      assert.equal(
        markdown.link("google", "http://www.google.com"),
        "[google](http://www.google.com)"
      );
      assert.equal(markdown.link("", "/img/1.png"), "[](/img/1.png)");
    });
    it("should return null if a blank path is give", () => {
      assert.equal(markdown.link("google", ""), null);
    });
  });
});

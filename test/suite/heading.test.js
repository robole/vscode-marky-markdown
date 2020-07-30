const assert = require("assert");
const heading = require("../../src/heading");

describe("heading", function () {
  describe("getLevel()", function () {
    it("should get the level of the heading", function () {
      assert.equal(heading.getLevel(" ## heading 2"), 2);
      assert.equal(heading.getLevel("not a heading"), 0);
    });
  });

  describe("stripMarkdown()", function () {
    it("should strip the markdown from the heading", function () {
      assert.equal(heading.stripMarkdown(" ## heading 2"), "heading 2");
      assert.equal(heading.stripMarkdown("## Commands ##"), "Commands");
    });
  });
});

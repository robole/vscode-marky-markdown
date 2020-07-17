const assert = require("assert");
const heading = require("../../src/heading");

let lines = null;

describe("heading", function () {
  describe("addLinks()", function () {
    beforeEach(function () {
      lines = [];
      lines[0] = "# Document title";
      lines[1] = "## Subheading 1 ✌ ##";
      lines[2] = "text";
    });

    afterEach(function () {
      lines = null;
    });

    it("should add links with the given text to each heading", function () {
      let expected = "# Document title,";
      expected += "## [∞](#subheading-1-) Subheading 1 ✌ ##,text";
      assert.equal(
        heading.addLinks(lines, "", "∞", "github", 2, 6).toString(),
        expected
      );
    });

    it("should add links with a given image to each heading", function () {
      let expected = "# Document title,";
      expected +=
        "## [![](/img/link.png)](#subheading-1-) Subheading 1 ✌ ##,text";
      assert.equal(
        heading.addLinks(lines, "/img/link.png", "", "github", 2, 6).toString(),
        expected
      );
    });

    it("should add links with given text and image to each heading", function () {
      let expected = "# Document title,";
      expected +=
        "## [![](/img/link.png) ∞](#subheading-1-) Subheading 1 ✌ ##,text";
      assert.equal(
        heading
          .addLinks(lines, "/img/link.png", "∞", "github", 2, 6)
          .toString(),
        expected
      );
    });

    it("should add links with given text and an image to each heading for a specific range of levels", function () {
      var expected =
        "# [![](/img/link.png) ∞](#document-title) Document title,";
      expected +=
        "## [![](/img/link.png) ∞](#subheading-1-) Subheading 1 ✌ ##,text";
      assert.equal(
        heading
          .addLinks(lines, "/img/link.png", "∞", "github", 1, 6)
          .toString(),
        expected
      );
    });

    it("should not add links to each heading when no text and no image are given", function () {
      assert.equal(
        heading.addLinks(lines, "", "", "github", 1, 6).toString(),
        lines
      );
    });
  });

  describe("removeLinks()", function () {
    beforeEach(function () {
      lines = [];
      lines[0] = "# Document title";
      lines[1] = "## [∞](#subheading-1-) Subheading 1 ✌";
      lines[2] =
        "### [∞ ![alt](/img.png)](#subheading-2-mister-) Subheading 2 mister 😊 ###";
    });

    afterEach(function () {
      lines = null;
    });

    it("should remove links from each heading", function () {
      let expected = "# Document title,";
      expected += "## Subheading 1 ✌,### Subheading 2 mister 😊 ###";
      assert.equal(heading.removeLinks(lines, 2, 6).toString(), expected);
    });

    it("should remove links from each heading from a specific level", function () {
      let expected = "# Document title,";
      expected +=
        "## [∞](#subheading-1-) Subheading 1 ✌,### Subheading 2 mister 😊 ###";
      assert.equal(heading.removeLinks(lines, 3, 3).toString(), expected);
    });

    it("should not change a heading with no link", function () {
      let noLinks = ["# Heading 1", "## Heading 2"];
      assert.equal(
        heading.removeLinks(noLinks, 1, 6).toString(),
        noLinks.toString()
      );
    });
  });

  describe("getAll()", function () {
    const TEXT1 =
      "# Heading 1\r\n\r\npppp\r\n\r\n## Heading 2\r\n\r\n### Heading 3";

    it("should get all headings from the text", function () {
      let headings = heading.getAll(TEXT1, 1);
      assert.equal(headings.length, 3);
    });

    it("should get all headings from the text from a selected range of levels (1 to 3)", function () {
      let headings = heading.getAll(TEXT1, 1, 2);
      assert.equal(headings.length, 2);
      assert.equal(headings[0], "# Heading 1");
      assert.equal(headings[1], "## Heading 2");
    });
  });

  describe("getLevel()", function () {
    it("should get the level of the heading", function () {
      assert.equal(heading.getLevel(" ## heading 2"), 2);
      assert.equal(heading.getLevel("not a heading"), 0);
    });
  });

  describe("stripMarkdown()", function () {
    it("should strip the markdown from the heading", function () {
      assert.equal(heading.stripMarkdown(" ## heading 2"), "heading 2");
      assert.equal(heading.stripMarkdown("## Commands"), "Commands");
    });
  });
});

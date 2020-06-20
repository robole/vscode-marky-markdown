const assert = require("assert");
const heading = require("../../src/heading");
const vscode = require("vscode");

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
        heading.addLinks(lines, "", "∞", "github", 2).toString(),
        expected
      );
    });

    it("should add links with a given image to each heading", function () {
      let expected = "# Document title,";
      expected +=
        "## [![](/img/link.png)](#subheading-1-) Subheading 1 ✌ ##,text";
      assert.equal(
        heading.addLinks(lines, "/img/link.png", "", "github", 2).toString(),
        expected
      );
    });

    it("should add links with given text and image to each heading", function () {
      let expected = "# Document title,";
      expected +=
        "## [![](/img/link.png) ∞](#subheading-1-) Subheading 1 ✌ ##,text";
      assert.equal(
        heading.addLinks(lines, "/img/link.png", "∞", "github", 2).toString(),
        expected
      );
    });

    it("should add links with given text and an image to each heading from a specific level down", function () {
      var expected = "# [![](/img/link.png) ∞](#document-title) Document title,";
      expected +=
        "## [![](/img/link.png) ∞](#subheading-1-) Subheading 1 ✌ ##,text";
        assert.equal(
          heading.addLinks(lines, "/img/link.png", "∞", "github", 1).toString(),
          expected
        );
    });

    it("should not add links to each heading when no text and no image are given", function () {
       assert.equal(
          heading.addLinks(lines, "", "", "github", 1).toString(),
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
      assert.equal(heading.removeLinks(lines, 2).toString(), expected);
    });

    it("should remove links from each heading from a specific level", function () {
      let expected = "# Document title,";
      expected +=
        "## [∞](#subheading-1-) Subheading 1 ✌,### Subheading 2 mister 😊 ###";
      assert.equal(heading.removeLinks(lines, 3).toString(), expected);
    });

    it("should not change a heading with no link", function () {
      let noLinks = ["# Heading 1", "## Heading 2"];
      assert.equal(heading.removeLinks(noLinks).toString(), noLinks.toString());
    });
  });
});

const assert = require("assert");
const doc = require("../../src/document");

let lines = null;

describe("Document", function () {
  describe("addBookmarks()", function () {
    beforeEach(function () {
      lines = [];
      lines[0] = "# Document title";
      lines[1] = "## Subdoc 1 ✌ ##";
      lines[2] = "text";
    });

    afterEach(function () {
      lines = null;
    });

    it("should add links with the given text to each doc", function () {
      let expected = "# Document title,";
      expected += "## [∞](#subdoc-1-) Subdoc 1 ✌ ##,text";
      assert.equal(
        doc.addBookmarks(lines, "", "∞", "github", 2, 6).toString(),
        expected
      );
    });

    it("should add links with a given image to each doc", function () {
      let expected = "# Document title,";
      expected += "## [![](/img/link.png)](#subdoc-1-) Subdoc 1 ✌ ##,text";
      assert.equal(
        doc.addBookmarks(lines, "/img/link.png", "", "github", 2, 6).toString(),
        expected
      );
    });

    it("should add links with given text and image to each doc", function () {
      let expected = "# Document title,";
      expected += "## [![](/img/link.png) ∞](#subdoc-1-) Subdoc 1 ✌ ##,text";
      assert.equal(
        doc
          .addBookmarks(lines, "/img/link.png", "∞", "github", 2, 6)
          .toString(),
        expected
      );
    });

    it("should add links with given text and an image to each doc for a specific range of levels", function () {
      var expected =
        "# [![](/img/link.png) ∞](#document-title) Document title,";
      expected += "## [![](/img/link.png) ∞](#subdoc-1-) Subdoc 1 ✌ ##,text";
      assert.equal(
        doc
          .addBookmarks(lines, "/img/link.png", "∞", "github", 1, 6)
          .toString(),
        expected
      );
    });

    it("should not add links to each doc when no text and no image are given", function () {
      assert.equal(
        doc.addBookmarks(lines, "", "", "github", 1, 6).toString(),
        lines
      );
    });
  });
  describe("removeBookmarks()", function () {
    beforeEach(function () {
      lines = [];
      lines[0] = "# Document title";
      lines[1] = "## [∞](#subdoc-1-) Subdoc 1 ✌";
      lines[2] =
        "### [∞ ![alt](/img.png)](#subdoc-2-mister-) Subdoc 2 mister 😊 ###";
    });

    afterEach(function () {
      lines = null;
    });

    it("should remove links from each doc", function () {
      let expected = "# Document title,";
      expected += "## Subdoc 1 ✌,### Subdoc 2 mister 😊 ###";
      assert.equal(doc.removeBookmarks(lines, 2, 6).toString(), expected);
    });

    it("should remove links from each doc from a specific level", function () {
      let expected = "# Document title,";
      expected += "## [∞](#subdoc-1-) Subdoc 1 ✌,### Subdoc 2 mister 😊 ###";
      assert.equal(doc.removeBookmarks(lines, 3, 3).toString(), expected);
    });

    it("should not change a doc with no link", function () {
      let noLinks = ["# doc 1", "## doc 2"];
      assert.equal(
        doc.removeBookmarks(noLinks, 1, 6).toString(),
        noLinks.toString()
      );
    });
  });

  describe("hasBookmarks()", function () {
    it("should return true if the docs within a range have bookmarks", function () {
      const TEXT1 =
        "# doc 1\r\n\r\npppp\r\n\r\n## [∞](#doc-2) doc 2\r\n\r\n### 3";
      assert.equal(doc.hasBookmarks(TEXT1, 2, 6), true);
      assert.equal(doc.hasBookmarks(TEXT1, 3, 6), false);
    });
  });

  describe("getHeadings()", function () {
    const TEXT1 =
      "# Heading 1\r\n\r\npppp\r\n\r\n## Heading 2\r\n\r\n### Heading 3";

    it("should get all headings from the text", function () {
      let headings = doc.getHeadings(TEXT1, 1);
      assert.equal(headings.length, 3);
    });

    it("should get all headings from the text from a selected range of levels (1 to 3)", function () {
      let headings = doc.getHeadings(TEXT1, 1, 2);
      assert.equal(headings.length, 2);
      assert.equal(headings[0], "# Heading 1");
      assert.equal(headings[1], "## Heading 2");
    });
  });

  describe("getGroupedHeadings()", function () {
    const TEXT1 =
      "# Heading 1\r\n\r\npppp\r\n\r\n## [∞](#heading-2) Heading 2 ##\r\n\r\n### 3 ###";

    it("should get all headings from the text formed into subgroups", function () {
      let headings = doc.getGroupedHeadings(TEXT1, 1, 6);
      assert.equal(headings.length, 3);
      assert.equal(headings[1].length, 5);
      assert.equal(headings[1][2], "[∞](#heading-2) ");
      assert.equal(headings[1][3], "Heading 2");
    });

    it("should get all headings from the text from a selected range of levels (1 to 3)", function () {
      let headings = doc.getGroupedHeadings(TEXT1, 1, 1);
      assert.equal(headings.length, 1);
      let headings2 = doc.getGroupedHeadings(TEXT1, 1, 3);
      assert.equal(headings2.length, 3);
    });
  });
});

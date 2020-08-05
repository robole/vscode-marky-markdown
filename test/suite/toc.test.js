let assert = require("assert");
const toc = require("../../src/toc");

const TEXT1 = "# Heading 1\r\n\r\npppp\r\n\r\n## Heading 2\r\n\r\n### 3";

describe("toc", function () {
  describe("create()", function () {
    const tab = "\t";

    it("should create a a table of contents", () => {
      assert.equal(
        toc.create(TEXT1, 2, 6, "github", "", "unordered list", tab, "\r\n"),
        "<!-- TOC -->\r\n- [Heading 2](#heading-2)\r\n\t- [3](#3)\r\n<!-- /TOC -->"
      );
    });

    it("should create a a table of contents for a range of levels", () => {
      assert.equal(
        toc.create(TEXT1, 1, 1, "github", "", "unordered list", tab, "\r\n"),
        "<!-- TOC -->\r\n- [Heading 1](#heading-1)\r\n<!-- /TOC -->"
      );
      assert.equal(
        toc.create(TEXT1, 2, 3, "github", "", "unordered list", tab, "\r\n"),
        "<!-- TOC -->\r\n- [Heading 2](#heading-2)\r\n\t- [3](#3)\r\n<!-- /TOC -->"
      );
    });

    it("should create a table of contents with the url defined by a slugify mode e.g. gitlab", () => {
      assert.equal(
        toc.create(TEXT1, 3, 6, "gitlab", "", "unordered list", tab, "\r\n"),
        "<!-- TOC -->\r\n- [3](#anchor-3)\r\n<!-- /TOC -->"
      );
    });

    it("should create a table of contents with a label", () => {
      assert.equal(
        toc.create(
          TEXT1,
          3,
          6,
          "gitlab",
          "table of contents",
          "unordered list",
          tab,
          "\r\n"
        ),
        "<!-- TOC -->\r\ntable of contents\r\n- [3](#anchor-3)\r\n<!-- /TOC -->"
      );
    });

    it("should create a table of contents with the end of line sequence you provide", () => {
      assert.equal(
        toc.create(
          TEXT1,
          3,
          6,
          "gitlab",
          "table of contents",
          "unordered list",
          tab,
          "\n"
        ),
        "<!-- TOC -->\ntable of contents\n- [3](#anchor-3)\n<!-- /TOC -->"
      );
    });

    it("should create a table of contents with the list type you provide", () => {
      assert.equal(
        toc.create(TEXT1, 2, 6, "github", "", "ordered list", tab, "\r\n"),
        "<!-- TOC -->\r\n1. [Heading 2](#heading-2)\r\n\t1. [3](#3)\r\n<!-- /TOC -->"
      );
    });
  });
});

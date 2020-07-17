const toc = require("../../src/toc");
var assert = require("assert");
const TEXT1 = "# Heading 1\r\n\r\npppp\r\n\r\n## Heading 2\r\n\r\n### 3";

describe("toc", function () {
  describe("create()", function () {
    it("should create a a table of contents", () => {
      assert.equal(
        toc.create(TEXT1, 2, "github"),
        "<!-- TOC -->\r\n- [Heading 2](#heading-2)\r\n\t- [3](#3)\r\n<!-- /TOC -->"
      );
    });

    it("should create a a table of contents beginning at a certain level", () => {
      assert.equal(
        toc.create(TEXT1, 3, "github"),
        "<!-- TOC -->\r\n- [3](#3)\r\n<!-- /TOC -->"
      );
    });

    it("should create a table of contents with the url defined by a slugify mode e.g. gitlab", () => {
      assert.equal(
        toc.create(TEXT1, 3, "gitlab"),
        "<!-- TOC -->\r\n- [3](#anchor-3)\r\n<!-- /TOC -->"
      );
    });

    it("should create a table of contents with a label", () => {
      assert.equal(
        toc.create(TEXT1, 3, "gitlab", "table of contents"),
        "<!-- TOC -->\r\ntable of contents\r\n- [3](#anchor-3)\r\n<!-- /TOC -->"
      );
    });

    it("should create a table of contents with the end of line sequence you provide", () => {
      assert.equal(
        toc.create(TEXT1, 3, "gitlab", "table of contents", "\n"),
        "<!-- TOC -->\ntable of contents\n- [3](#anchor-3)\n<!-- /TOC -->"
      );
    });
  });
});

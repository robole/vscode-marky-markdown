let assert = require("assert");
const util = require("../../src/util");

describe("util", function () {
  describe("slugify()", function () {
    // github mode
    it("should slugify 'github' mode by creating a trimmed, lowercase, hypenated version of the string", () => {
      assert.equal(
        util.slugify(" Robole Github com ", "github"),
        "robole-github-com"
      );
    });

    it("should slugify 'github' mode by removing characters that are not: a letter, space or hypen", () => {
      assert.equal(util.slugify("robole 🙏 com", "github"), "robole--com");
      assert.equal(
        util.slugify("Uniform Resource Locator (URL)", "github"),
        "uniform-resource-locator-url"
      );
      assert.equal(util.slugify("[re] [] [f])", "github"), "re--f");
      assert.equal(
        util.slugify("[robole.github.io", "github"),
        "robolegithubio"
      );
      assert.equal(util.slugify("robole 🙏 com-", "github"), "robole--com-");
      assert.equal(util.slugify("ha 🐇-👎", "github"), "ha--");
    });

    // gitlab mode
    it("should slugify 'gitlab' mode by creating a trimmed, lowercase, hypenated version (only 1 hypen allowed between words) of the string", () => {
      assert.equal(util.slugify("  robole  com p ", "gitlab"), "robole-com-p");
    });

    it("should slugify 'gitlab' mode by removing characters that are not: a letter, space or hypen", () => {
      assert.equal(util.slugify("robole 🙏 com", "gitlab"), "robole-com");
      assert.equal(
        util.slugify("Uniform Resource Locator (URL)", "gitlab"),
        "uniform-resource-locator-url"
      );
      assert.equal(util.slugify("[re] [] [f])", "gitlab"), "re-f");
      assert.equal(
        util.slugify("[robole.github.io", "gitlab"),
        "robolegithubio"
      );
      assert.equal(util.slugify("robole 🙏 com1-", "gitlab"), "robole-com1-");
      assert.equal(util.slugify("ha 🐇-👎", "gitlab"), "ha-");
    });

    it("should slugify 'gitlab' mode where a numeric-only slug is prefixed with 'anchor-'", () => {
      assert.equal(util.slugify("123", "gitlab"), "anchor-123");
      assert.equal(util.slugify("1.2 []", "gitlab"), "12-");
    });
  });
});

const util = require("../../src/util");
var assert = require("assert");

describe("util", function () {
  describe("slugify()", function () {
    it("should slugify github style by creating a lowercase and hypenated version of string", () => {
      assert.equal(
        util.slugify("Robole Github com", "github"),
        "robole-github-com"
      );
    });
    it("should slugify github style by removing characters that are not a letter, space or hypen", () => {
      assert.equal(util.slugify("robole 🙏 com", "github"), "robole--com");
      assert.equal(
        util.slugify("Uniform Resource Locator (URL)"),
        "uniform-resource-locator-url"
      );
      assert.equal(util.slugify("[re] [] [f])", "github"), "re--f");
      assert.equal(
        util.slugify("[robole.github.io"),
        "robolegithubio"
      );
    });
    it("should slugify github style by replacing spaces with hypens", () => {
      assert.equal(util.slugify("robole 🙏 com-", "github"), "robole--com-");
      assert.equal(util.slugify("ha 🐇-👎", "github"), "ha--");
      assert.equal(
        util.slugify("  robole  com p ", "github"),
        "robole--com-p"
      );
      assert.equal(util.slugify("Subutil 1 ✌","github"), "subutil-1-");
    });
  });
});

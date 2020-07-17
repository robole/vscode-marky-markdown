const settings = require("../../src/settings");
var expect = require("chai").expect;

describe("settings", function () {
  describe("getLevels()", function () {
    it("should return an array with 2 entries which are numbers between 1 and 6", () => {
      expect(settings.getLevels("2..6")).is.eql([2, 6]);
      expect(settings.getLevels("10..6")).is.eql([]);
      expect(settings.getLevels("blah..6")).is.eql([]);
    });
  });
});

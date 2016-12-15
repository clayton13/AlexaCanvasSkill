// Tests the abilty of the fuzzy search in courseSearch module.

var User = require('../../canvasConnection');
var fs = require('fs');
var courseSearch = require("../courseSearch");
var x = new User();

var courses = JSON.parse(fs.readFileSync('coursemeta.json', 'utf8'));
var searches = ["comp", "comp 2", "composition", "math", "calculus", "stem", "stem seminar", "honors", "lead", "leadership", "speech", "presentations"];

searches.forEach((query, index) => {
    var result = courseSearch(courses, query);
    console.log(result)
});

process.exit();

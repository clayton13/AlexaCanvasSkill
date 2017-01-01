// Module to contain the fuzzy search method for finding a 
//  course based on its name and properties.

var Fuse = require("fuse.js")
var fs = require('fs');

var options = {
    include: ["score"],
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [{
        name: 'nickname',
        weight: 0.35
    }, {
        name: 'nicknames',
        weight: 0.30
    }, {
        name: 'meta.title',
        weight: 0.20
    }, {
        name: 'meta.rawInfo',
        weight: 0.15
    }]
};
module.exports = search;

function search(courses, query) {
    var fuse = new Fuse(courses, options); // "list" is the item array

    var result = fuse.search(query);
    // console.log(result)

    var match;
    for (match of result) {
        if (match.score < .3) {
            console.log("Matched: " + query + " to " + match.item.meta.title);
            return match.item;
        } else {
            console.log("Need clarification for " + query);
            // console.log(result[0].score)
            return result;
        }
    }
}

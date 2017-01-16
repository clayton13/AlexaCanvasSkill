// Course
'use strict';
var https = require('https');
// var request = require("request");
var globals = require('../globals');
var CustomError = require('../customerror');

var fs = require('fs');
var courseSearch = require("./courseSearch");
var _ = require("underscore");

//Private vars
var metaCourses = [];
var test = "ADSf"

module.exports = Assignment;

function Assignment(data, User) {
    //Make assignment properties root level. Ie you can do this.name just like data.name
    _.extend(this, data);

    // this.User = User;
}

Assignment.prototype.getGradedDate = function() {
    if (this.isForCredit())
        return new Date(this.submission.graded_at)
    else
        return null;
}

Assignment.prototype.isForCredit = function() {
    return (this.points_possible > 0 && typeof this.submission == "object")
}

Assignment.prototype.getGrade = function() {
    //If graded/forcredit assignment
    if (this.isForCredit() && this.submission.graded_at !== null) {
        if (this.submission.grade.indexOf('%') > 0) {
            return [
                //Get rid of trailing zeros, get rid of %, convert to 2 digit
                //TODO Clean up
                parseFloat(parseFloat(this.submission.grade.replace("%", "")).toFixed(2))
            ]
        } else {
            var score = (this.submission.score / this.points_possible) * 100;
            score = parseFloat(score.toFixed(2))
            return [
                score,
                this.submission.score,
                this.points_possible
            ]
        }
    } else {
        //Not graded/not a factored in score
        return false; //"This assignment is not for credit";
        // return new CustomError('This assignment is not for credit', 42);
    }

}

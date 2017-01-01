// Course
'use strict';
var https = require('https');
// var request = require("request");
var globals = require('../globals');
var fs = require('fs');
var courseSearch = require("./courseSearch");
var _ = require("underscore");
var Assignment = require('./Assignment');
var storage = require('../storage');
var User = require('./CanvasUser');
var storage = require('../storage');


function isValidObject(obj) {
    if ((typeof(obj) !== 'undefined') && (obj !== null)) {
        return Object.keys(obj).length;
    } else
        return false;
}



module.exports = Course;

function Course(data, User) {
    console.log(data.id)
        //Make course properties root level. Ie you can do this.name just like data.name
    _.extend(this, data);

    this.UserToken = User.token;
    this.Assignments = [];
}

// function loadNicknames() {

// }
// Course.prototype.loadNicknames = loadNicknames;

//TODO post issue to github for Instructure, the ids get too long and are losing percison 
//  when being JSON.parsed. The ids will chnage and will result in a bad request for that course.
//  They are exceeding  Number.MAX_SAFE_INTEGER = 9007199254740991 by a whole decade...
//  for example:
//  var object  = JSON.parse('{"id":11580000001223015}')
//  object.id
//      11580000001223016
//  The five changed to a six
//  Temp Soln: http://stackoverflow.com/questions/20408537/parsing-big-numbers-in-json-to-strings
//  Soln: Wrap these ids with strings to begin with.
Course.prototype.getAssignments = function(callback) {
    var params = {
        'include[]': ['assignment_visibility',
            'all_dates',
            'submission'
        ],
        'per_page': 99
    };
    // console.log(this.id)

    // console.log(this.account_id)
    var _this = this;

    storage.makeGET("/api/v1/courses/" + this.id + "/assignments/", params, this.UserToken, function(rawAssignments) {
        // var rawCourses = fs.readFileSync("./coursesSample.json", 'utf8');
        var assignments = JSON.parse(rawAssignments);
        // fs.writeFile("assignment.json", JSON.stringify(assignments));
        // console.log(assignments)
        assignments.forEach((assignment, index) => {
            var assignment = new Assignment(assignment, _this)
            if (assignment.isForCredit()) {
                console.log(assignment.getGrade()[0] + "\t" + assignment.name)

            } else {
                console.log("NOT" + "\t" + assignment.name)

            }
            _this.Assignments.push(assignment)
                // var course = new Course(course, this);
                // this.courses.push(course)

            // console.log(course.name + ":  Grade is " + course.getGrade())
        });
        // console.log(_this.Assignments[0].name)
        // console.log(_this.Assignments[1].name)
        _this.sortAssignments();
        // var arr = _this.getLastGraded();
        // arr.forEach(assignment => {
        //     console.log(assignment.name)
        // })

        var c = callback || function() {};
        c(_this.Assignments);
        // console.log()
        // console.log(_this.Assignments[0].name)
        // console.log(_this.Assignments[1].name)

    })



};

function changeNickname(name) {
    storage.makePUT("/api/v1/users/self/course_nicknames/" + this.id + "/", "nickname=" + name, this.UserToken).then(function(d) {
        console.log("change nickname to: " + d.name);
        return d;
    });
}
Course.prototype.changeNickname = changeNickname;


Course.prototype.getGrade = function() {
    if (this.enrollments.length > 0) {
        return this.enrollments[0].computed_current_score;
    }
    return "No grade found";
};


Course.prototype.sortAssignments = function() {
    this.Assignments.sort(function(a, b) {
        var date1 = a.getGradedDate();
        var date2 = b.getGradedDate();
        if (!isFinite(date1 - date2))
            return !isFinite(date1) ? 1 : -1;
        else
            return date1 - date2;
    });
}
Course.prototype.getLastGraded = function(number) {
    //Prevent index out of bounds
    var indexes = Math.min(this.Assignments.length, number);
    return this.Assignments.slice(-indexes);
}

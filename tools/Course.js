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
Course.prototype.getAssignments = function(forceRefresh) {
    var params = {
        'include[]': ['assignment_visibility',
            'all_dates',
            'submission'
        ],
        'per_page': 99
    };

    // if there is already course data use that else fetch it
    if (typeof this.Assignments != "undefined" && this.Assignments != null && this.Assignments.length > 0) {
        console.log("Reusing assignment data");
        return Promise.resolve(this.Assignments);
    } else {
        console.log("Fetching assignment data");
        return storage.makeGET("/api/v1/courses/" + this.id + "/assignments/", params, this.UserToken).bind(this).then(assignments => {
            assignments.forEach((assignment, index) => {
                var assignment = new Assignment(assignment, this);
                if (assignment.isForCredit()) {
                    console.log(assignment.getGrade()[0] + "\t" + assignment.name);
                } else {
                    console.log("NOT" + "\t" + assignment.name);
                }
                this.Assignments.push(assignment);
                // var course = new Course(course, this);
                // this.courses.push(course)

                // console.log(course.name + ":  Grade is " + course.getGrade())
            });

            this.sortAssignments();

            return this.Assignments;
        });
    }
};

Course.prototype.changeNickname = function(name) {
    storage.makePUT("/api/v1/users/self/course_nicknames/" + this.id + "/", "nickname=" + name, this.UserToken).then(function(d) {
        console.log("change nickname to: " + d.nickname);
        return d;
    });
};

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
    // console.log(this)

    var doLastGraded = function(number) {
        var indexes = Math.min(this.Assignments.length, number);
        return this.Assignments.slice(-indexes);
    }.bind(this);

    return this.getAssignments().then(function() {
        var lastGraded = doLastGraded(number);
        return lastGraded;
    });
}

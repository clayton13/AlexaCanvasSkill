'use strict';
var https = require('https');
var querystring = require('querystring');

// var request = require("request");
var globals = require('../globals');
var fs = require('fs');
var courseSearch = require("./courseSearch");
var Course = require('./Course');
var _ = require("underscore");
var Promise = require("bluebird");
var storage = require('../storage');
//Private vars
var metaCourses = [];
var test = "ADSf"

module.exports = User;

function isValidObject(obj) {
    if ((typeof(obj) !== 'undefined') && (obj !== null)) {
        return Object.keys(obj).length;
    } else
        return false;
}

function isEmptyObject(obj) {
    if ((typeof(obj) !== 'undefined') && (obj !== null)) {
        return !Object.keys(obj).length;
    } else
        return true;
}

function User(data) {
    _.extend(this, data);

    this.courses = [];
    if (isValidObject(data) && isValidObject(data.user_data) && isValidObject(data.user_data.canvas_account)) {
        var canvas_account = this.user_data.canvas_account;

        this.token = canvas_account.access_token; // || "1158~P50n2PE3zT2XGYEMidZXP0Tm83CCCpjeGT5IrPpQV4vQjET2LtqYWUvKzseD3HeE";
        this.courses = JSON.parse(JSON.stringify(data.courses || [])) || [];
        // this.getCourses();
    }

}


function testCanvasAccount(token) {
    return this.getAccount(token).then(cUser => {
        return cUser;
    }).catch(e => {
        var err = e.error;
        // if (!isEmptyObject(e.error) && e.error.errors[0].message === "Invalid access token.") {
        //     console.log("gotcha")
        //     return false;
        // }
        return false;
    });
}
User.prototype.testCanvasAccount = testCanvasAccount;

function getAccount(token) {
    return storage.makeGET("/api/v1/users/self/profile/", null, token);
}
User.prototype.getAccount = getAccount;


function getUpcommingEvents() {
    return storage.makeGET("/api/v1/users/self/upcoming_events", null, this.token).then(events => {

        if (isValidObject(events) && events.length > 0) {
            return events;
        } else {
            return false;
        }
    });
}
User.prototype.getUpcommingEvents = getUpcommingEvents;

function getTodoItems() {
    return storage.makeGET("/api/v1/users/self/todo", null, this.token).then(items => {

        if (isValidObject(items) && items.length > 0) {
            return items;
        } else {
            return false;
        }
    });
}
User.prototype.getTodoItems = getTodoItems;


function getCourses() {
    var params = {
        'include[]': ['needs_grading_count',
            // 'syllabus_body',
            'total_scores',
            'term',
            'permissions',
            'current_grading_period_scores',
            'favorites'
        ]
    };

    // if there is already course data use that else fetch it
    if (typeof this.Assignments != "undefined" && this.Assignments != null && this.Assignments.length > 0) {
        console.log("Reusing assignment data");
        return Promise.resolve(this.courses);
    } else {
        console.log("Fetching assignment data");
        return storage.makeGET("/api/v1/courses/", params, this.token).bind(this).then(courses => {
            console.log("GOT COURSES")

            courses.forEach((course, index) => {
                //is course has not not opened yet for student access
                var isRestricted = course.access_restricted_by_date || false;

                if (!isRestricted) {
                    var course = new Course(course, this);
                    course.nicknames = course.nicknames || [];
                    course.meta = {};
                    course.meta.title = "";
                    course.meta.rawInfo = "";
                    this.courses.push(course)

                    console.log(course.name);
                    console.log("\t" + course.nicknames);
                }
            });
        }).then(this.matchNicknames).thenReturn(this.courses);
    }
}
User.prototype.getCourses = getCourses;


function getNicknames(course) {
    if (course === "" || course == null) {
        course = "";
    } else {
        course += "/";
    }

    return storage.makeGET("/api/v1/users/self/course_nicknames/" + course, null, this.token).then(function(names) {
        console.log('Got nicknames');
        return names;
    });
}
User.prototype.getNicknames = getNicknames;

function matchNicknames() {
    return this.getNicknames(null).then(names => {
        var matches = [];
        var qmatches = [];
        var match;
        var regex = /^([A-Z]{3})(\d{4}[A-Z]{0,1})/;
        this.courses.forEach((dbcourse, index) => {
            names.forEach((course, index) => {

                var nicknameArr = this.nicknames[dbcourse.id]
                if (isValidObject(nicknameArr)) {
                    dbcourse.nicknames = nicknameArr;
                }

                if (dbcourse.original_name === course.name) {
                    dbcourse.nickname = course.nickname;
                    dbcourse.shortId = course.course_id;
                    console.log("matched :" + dbcourse.original_name + " to " + course.nickname)
                }
            });
        });
    })
}
User.prototype.matchNicknames = matchNicknames;

function findCourse(query, callback) {
    var doSearch = function(courses, query) {
        var result = courseSearch(courses, query);

        if (Array.isArray(result)) {
            console.log("Not a concrete match found");
            callback(result);
        } else {
            callback(result);
        }
    }.bind(this);

    //if there is already course data use that else fetch it
    if (typeof this.courses != "undefined" && this.courses != null && this.courses.length > 0) {
        doSearch(this.courses, query);
    } else {
        this.getCourses().then(function() {
            doSearch(this.courses, query);
        });
    }
}
User.prototype.findCourse = findCourse;

function getLastGraded(number) {

    var doLastGraded = function(number) {
        var prr = [];
        var assignmentsArr = [];

        this.courses.forEach((course, index) => {
            var x = course.getAssignments().then(assignments => {
                var indexes = Math.min(assignments.length, number);
                assignmentsArr = assignmentsArr.concat(assignments.slice(-indexes));
            });
            prr.push(x);
        });

        return Promise.all(prr).then(function() {
            this.sortAssignments(assignmentsArr);

            var indexes = Math.min(assignmentsArr.length, number);
            return assignmentsArr.slice(-indexes);
        }.bind(this));
    }.bind(this);

    return this.getCourses().then(function() {
        return doLastGraded(number);
    });
};
User.prototype.getLastGraded = getLastGraded;


function sortAssignments(assignments) {
    assignments.sort(function(a, b) {
        var date1 = a.getGradedDate();
        var date2 = b.getGradedDate();
        if (!isFinite(date1 - date2))
            return !isFinite(date1) ? 1 : -1;
        else
            return date1 - date2;
    });
}
User.prototype.sortAssignments = sortAssignments;

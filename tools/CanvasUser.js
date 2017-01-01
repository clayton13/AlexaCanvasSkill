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


function User(data) {
    _.extend(this, data);

    if (isValidObject(data) && isValidObject(data.user_data) && isValidObject(data.user_data.canvas_account)) {
        var canvas_account = this.user_data.canvas_account;

        this.token = canvas_account.access_token; // || "1158~P50n2PE3zT2XGYEMidZXP0Tm83CCCpjeGT5IrPpQV4vQjET2LtqYWUvKzseD3HeE";
        this.courses = JSON.parse(JSON.stringify(data.courses || [])) || [];
        // this.getCourses();
    }

}

function testCanvasAccount(token, callback) {
    this.getAccount(access_token, function(cUser) {
        var cUser = JSON.parse(cUser);
        if (!isEmptyObject(cUser.errors) && cUser.errors[0].message === "Invalid access token.") {

        } else {

        }
    })

}
User.prototype.getAccount = getAccount;

function getAccount(token, callback) {
    storage.makeGET("/api/v1/users/self/profile/", null, token, function(d) {
        console.log("got account: " + d + "\n\n");
        callback(d)
    });
}
User.prototype.getAccount = getAccount;

function getUpcommingEvents(callback) {
    var _this = this;
    storage.makeGET("/api/v1/users/self/upcoming_events", null, this.token, function(rawEvents) {

        var events = JSON.parse(rawEvents);
        if (isValidObject(events) && events.length > 0) {
            callback(events)
        } else {
            callback(false)
        }

        callback(_this.courses)
    })
}
User.prototype.getUpcommingEvents = getUpcommingEvents;

function getTodoItems(callback) {
    var _this = this;
    storage.storage.makeGET("/api/v1/users/self/todo", null, this.token, function(rawTodo) {

        var items = JSON.parse(rawTodo);
        if (isValidObject(items) && items.length > 0) {
            callback(items)
        } else {
            callback(false)
        }
    })
}
User.prototype.getTodoItems = getTodoItems;


function getCourses(callback) {
    var params = {
        'include[]': ['needs_grading_count',
            'syllabus_body',
            'total_scores',
            'term',
            'permissions',
            'current_grading_period_scores',
            'favorites'
        ]
    };

    var _this = this;
    storage.makeGET("/api/v1/courses/", params, this.token, function(rawCourses) {
        // var rawCourses = jsonFix(fs.readFileSync("./coursesSample.json", 'utf8'))
        console.log("GOT COURSES")
        var courses = JSON.parse(rawCourses);
        courses.forEach((course, index) => {
            var course = new Course(course, _this);
            course.nicknames = course.nicknames || [];
            course.meta = {};
            course.meta.title = "";
            course.meta.rawInfo = "";
            _this.courses.push(course)



            // if (course.id == "11580000001s212081") {
            //     var course = new Course(course, _this);
            //     // this.courses.push(course)

            //     console.log(course.name + ":  Grade is " + course.getGrade());
            //     // course.getAssignments()
            // }
        });
        _this.matchNicknames(function() {
            callback(_this.courses)
        })
    })
}
User.prototype.getCourses = getCourses;

User.prototype.getMetaCourses = function() {
    return metaCourses;
};

// //  Temp Soln: http://stackoverflow.com/questions/20408537/parsing-big-numbers-in-json-to-strings
// function jsonFix(json) {
//     return json.replace(/([\[:])?(\d{10,})([,\}\]])/g, "$1\"$2\"$3");
// }
// //Makes a put request to canvas
// function makePUT(path, data, token, callback) {
//     var options = {
//         host: globals.BASE_URL,
//         headers: {
//             "Authorization": "Bearer " + token,
//             // 'content-length': 150,
//             'content-type': 'application/x-www-form-urlencoded',
//             'Expect': '100-continue',
//             // 'User-Agent': 'curl/7.38.0',
//             'Accept': '*/*',
//             //Boy I really hate this stinking line of code, apparently it makes the world
//             //  of differnce in making PUT requests from node. On stackoverflow I did not
//             //  see one answer refrencing this...well that was 3+hours down the toilet.
//             //  Lesson learned....READ THE DOCS!
//             //  "It's suggested to use the ['Transfer-Encoding', 'chunked'] header line when creating the request."
//             'Transfer-Encoding': 'chunked'
//         },
//         path: path,
//         method: 'PUT'
//     };
//     var req = https.request(options, function(res) {
//         // console.log('STATUS: ' + res.statusCode);
//         // console.log('HEADERS: ' + JSON.stringify(res.headers));
//         res.setEncoding('utf8');
//         var data = ""
//         res.on('data', function(chunk) {
//             data += chunk;
//             // console.log('BODY: ' + chunk);
//         });
//         res.on("end", function() {
//             data = jsonFix(data)
//             callback(data);
//             res.removeAllListeners('data');
//         })
//     });

//     req.on('error', function(e) {
//         console.log('-------\nERROR WITH REQUEST-------\n' + e.message);
//     });

//     req.write(data);
//     req.end();
// }
// User.prototype.makePUT = makePUT;

// function storage.storage.makeGET(path, data, token, callback) {
//     var options = {
//         host: globals.BASE_URL,
//         headers: {
//             "Authorization": "Bearer " + token,
//             // 'content-length': 150,
//             'content-type': 'application/x-www-form-urlencoded',
//             'Expect': '100-continue',
//             // 'User-Agent': 'curl/7.38.0',
//             'Accept': '*/*',
//             //Boy I really hate this stinking line of code, apparently it makes the world
//             //  of differnce in making PUT requests from node. On stackoverflow I did not
//             //  see one answer refrencing this...well that was 3+hours down the toilet.
//             //  Lesson learned....READ THE DOCS!
//             //  "It's suggested to use the ['Transfer-Encoding', 'chunked'] header line when creating the request."
//             'Transfer-Encoding': 'chunked'
//         },
//         path: path,
//         method: 'GET',

//     };
//     var req = https.request(options, function(res) {
//         // console.log('STATUS: ' + res.statusCode);
//         // console.log('HEADERS: ' + JSON.stringify(res.headers));
//         res.setEncoding('utf8');
//         var data = ""
//         res.on('data', function(chunk) {
//             data += chunk;
//             // console.log('BODY: ' + chunk);
//         });
//         res.on("end", function() {
//             data = jsonFix(data)
//             callback(data);
//             res.removeAllListeners('data');
//         })
//     });

//     req.on('error', function(e) {
//         console.log('-------\ERROR WITH REQUEST-------\n' + e.message);
//     });

//     if (data) {
//         req.write(querystring.stringify(data));
//     }
//     // console.log(req._body)
//     req.end();
// }
// User.prototype.storage.storage.makeGET = storage.storage.makeGET;


function getNicknames(course, token, callback) {
    if (course === "" || course == null) {
        course = "";
    } else {
        course += "/";
    }

    storage.makeGET("/api/v1/users/self/course_nicknames/" + course, null, token, function(d) {
        console.log("got nicknames: " + d + "\n\n");
        callback(d)
    });
}
User.prototype.getNicknames = getNicknames;

function matchNicknames(callback) {
    getNicknames(null, this.token, processNicknames);
    var _this = this;

    function processNicknames(names) {
        var data = JSON.parse(names);

        // console.log(data)

        var matches = [];
        var qmatches = [];
        var match;
        var regex = /^([A-Z]{3})(\d{4}[A-Z]{0,1})/;
        _this.courses.forEach((dbcourse, index) => {
            data.forEach((course, index) => {

                var nicknameArr = _this.nicknames[dbcourse.id]
                if (isValidObject(nicknameArr)) {
                    dbcourse.nicknames = nicknameArr;
                }

                if (dbcourse.original_name === course.name) {
                    dbcourse.nickname = course.nickname;
                    dbcourse.shortId = course.course_id;
                    console.log("matched :" + dbcourse.original_name + " to " + course.nickname)
                }
                // if ((dbcourse.id).toString().includes(course.course_id) || (dbcourse.id) == (course.id)) {}

            });
        });

        callback();
    }
}

User.prototype.matchNicknames = matchNicknames;



function matchEnrollments(token, callback) {
    var str = fs.readFileSync(globals.COURSE_DATABASE, 'utf8');
    var database = JSON.parse(str);

    getNicknames(null, token, processNames);

    function processNames(names) {
        var data = JSON.parse(names);
        var query = "speech"

        // console.log(data)
        // var metaCourses = [];
        var matches = [];
        var qmatches = [];
        var match;
        var regex = /^([A-Z]{3})(\d{4}[A-Z]{0,1})/;
        database.forEach((dbcourse, index) => {
            data.forEach((course, index) => {
                //                 console.log( "------new-------")
                // console.log(course )
                // console.log( "\n------")
                var titleData = regex.exec(course.name)
                    // console.log(titleData)
                var name = titleData[1] + " " + titleData[2]; // (course.name).substring(0,3) + " " + (course.name).substring(3, );
                //  console.log("------" + dbcourse.name + "- -" + name + "----" + course.name)
                if (dbcourse.name === name) {
                    console.log("------------match titles------- " + name)
                        // dbcourse.nickname = course.nickname;

                    course.meta = dbcourse;
                    metaCourses.push(course);

                }
            });
        });

        callback();
    }

}

User.prototype.findCourse = findCourse;

function findCourse(query, callback) {
    console.log("test")

    function doSearch(courses, query) {
        // console.log(JSON.stringify(courses))
        var result = courseSearch(courses, query);
        // console.log(result)
        if (Array.isArray(result)) {
            console.log("Not a concrete match found");
            callback(result);
        } else {
            callback(result);
        }
    }

    if (typeof this.courses != "undefined" && this.courses != null && this.courses.length > 0) {
        doSearch(this.courses, query);
    } else {
        var _this = this
        this.getCourses(function() {
            doSearch(_this.courses, query);
        });
    }
}

// User.prototype.getLastGraded = getLastGraded;

// function getLastGraded(number, callback) {
//     //Prevent index out of bounds
//     Promise.longStackTraces();

//     var p = Promise.promisify(this.getCourses, {
//         context: this
//     });
//     var prr = []
//     var assignmentsArr = [];

//     p().then(function() {
//         // console.log(this.courses);.
//         console.log("________________________________________")

//         this.courses.forEach((course, index) => {
//             var x = Promise.promisify(course.getAssignments)
//             prr.push(x)
//             x().then(function(assignments) {
//                 console.log("________________________________________")
//                 var indexes = Math.min(assignments.length, number);
//                 assignmentsArr = assignmentsArr.concat(assignments.slice(-indexes));
//             })


//         })

//         console.log("ASdfASasdfasdfsd")

//         console.log(prr)
//         Promise.all(prr).then(function() {
//             console.log(assignmentsArr.length);
//             throw new Error()
//         })
//     }).catch(function(err) {
//         // console.log(err);

//         // console.log(err.message);
//         // console.log(err.stack);
//     });



//     // console.log(this);
//     //         Promise.promisify(this.courses[0].getAssignments).then(function(assignments) {
//     //         console.log("Asdf")
//     //         var indexes = Math.min(assignments.length, number);
//     //         assignmentsArr = assignmentsArr.concat(assignments.slice(-indexes));
//     //     }))


//     // var assignmentsArr = [];
//     // var prr = []
//     // this.courses.forEach((course, index) => {
//     //     prr.push(Promise.promisify(course.getAssignments).then(function(assignments) {
//     //         console.log("Asdf")
//     //         var indexes = Math.min(assignments.length, number);
//     //         assignmentsArr = assignmentsArr.concat(assignments.slice(-indexes));
//     //     }))
//     // })

//     // Promise.all(prr).then(function() {
//     //     console.log(assignmentsArr);

//     //     assignmentsArr.sort(function(a, b) {
//     //         var date1 = a.getGradedDate();
//     //         var date2 = b.getGradedDate();
//     //         if (!isFinite(date1 - date2))
//     //             return !isFinite(date1) ? 1 : -1;
//     //         else
//     //             return date1 - date2;
//     //     });


//     //     // if (course.id == "11580000001s212081") {
//     //     //     var course = new Course(course, _this);
//     //     //     // this.courses.push(course)

//     //     //     console.log(course.name + ":  Grade is " + course.getGrade());
//     //     //     // course.getAssignments()
//     //     callback(assignmentsArr.slice(-number))
//     // });
// }

// var u = new User()
// console.log(u)
// u.getCourses();

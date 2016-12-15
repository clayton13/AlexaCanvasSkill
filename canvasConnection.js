'use strict';
var https = require('https');
// var request = require("request");
var globals = require('./globals');
var fs = require('fs');

//Private vars
var metaCourses = [];
var test = "ADSf"

module.exports = User;

function User() {
    this.token = "13~Rd735JtbD2tHTfc8YUlHR1VCShLx8nMAicDdBRfUOif7XK3N5DJELRlFQ8ICwNx5";
}

//Makes a put request to canvas
function makePUT(path, data, token, callback) {
    console.log(globals.BASE_URL)
    var options = {
        host: globals.BASE_URL,
        headers: {
            "Authorization": "Bearer " + token,
            // 'content-length': 150,
            'content-type': 'application/x-www-form-urlencoded',
            'Expect': '100-continue',
            // 'User-Agent': 'curl/7.38.0',
            'Accept': '*/*',
            //Boy I really hate this stinking line of code, apparently it makes the world
            //  of differnce in making PUT requests from node. On stackoverflow I did not
            //  see one answer refrencing this...well that was 3+hours down the toilet.
            //  Lesson learned....READ THE DOCS!
            //  "It's suggested to use the ['Transfer-Encoding', 'chunked'] header line when creating the request."
            'Transfer-Encoding': 'chunked'
        },
        path: path,
        method: 'PUT'
    };
    var req = https.request(options, function(res) {
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            // console.log('BODY: ' + chunk);
            res.removeAllListeners('data');
            callback(chunk);
        });
    });

    req.on('error', function(e) {
        console.log('-------\nERROR WITH REQUEST-------\n' + e.message);
    });

    req.write(data);
    req.end();
}

function makeGET(path, data, token, callback) {
    console.log(globals.BASE_URL)
    var options = {
        host: globals.BASE_URL,
        headers: {
            "Authorization": "Bearer " + token,
            // 'content-length': 150,
            'content-type': 'application/x-www-form-urlencoded',
            'Expect': '100-continue',
            // 'User-Agent': 'curl/7.38.0',
            'Accept': '*/*',
            //Boy I really hate this stinking line of code, apparently it makes the world
            //  of differnce in making PUT requests from node. On stackoverflow I did not
            //  see one answer refrencing this...well that was 3+hours down the toilet.
            //  Lesson learned....READ THE DOCS!
            //  "It's suggested to use the ['Transfer-Encoding', 'chunked'] header line when creating the request."
            'Transfer-Encoding': 'chunked'
        },
        path: path,
        method: 'GET'
    };
    var req = https.request(options, function(res) {
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            // console.log('BODY: ' + chunk);
            res.removeAllListeners('data');
            callback(chunk);
        });
    });

    req.on('error', function(e) {
        console.log('-------\ERROR WITH REQUEST-------\n' + e.message);
    });

    if (data) {
        req.write(data);
    }
    console.log(req._body)
    req.end();

}
User.prototype.makeGET = makeGET;

//Changes course nickname for a given course id
function changeNickname(course, name, token) {
    makePUT("/api/v1/users/self/course_nicknames/+" + course + "/", "nickname=" + name, token, function(d) {
        console.log("changed: " + d);
    });
}
User.prototype.changeNickname = changeNickname;

function getNicknames(course, token, callback) {
    if (course === "" || course == null) {
        course = "";
    } else {
        course += "/";
    }

    makeGET("/api/v1/users/self/course_nicknames/" + course, null, token, function(d) {
        console.log("got: " + d);
        callback(d)
    });
}
User.prototype.getNicknames = getNicknames;

function matchEnrollments(token, callback) {
    var str = fs.readFileSync(globals.COURSE_DATABASE, 'utf8');
    var database = JSON.parse(str);

    getNicknames(null, token, processNames);

    function processNames(names) {
        var data = JSON.parse(names);
        var query = "speech"

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

    function doSearch(query) {
        metaCourses.forEach((course, index) => {
            var qstring = JSON.stringify(course)
            qstring = qstring.toLowerCase();
            if (qstring.includes(query)) {
                // match = course;
                console.log("MATCH: " + course.meta.title);
                callback(course);
                return;
            }
        });
    }

    if (typeof metaCourses != "undefined" && metaCourses != null && metaCourses.length > 0) {
        doSearch(query);
    } else {
        matchEnrollments(this.token, function() {
            doSearch(query);
        });
    }
}




function getGrade(course, callback) {
    course.id = course.id || course.course_id;
    console.log("looking for: " +course.id)
    //So canvas returns two types of ids, one with a bunch of padding 0s and
    //  one without. But their API is picky and at times only will accept
    //  the one with the padding...
    //Get all enrollments
    //Loop over courses find one with matching substring id
    //Return that grade
    makeGET("/api/v1/courses/", "include[]=total_scores", this.token, function(d) {
        // console.log("got: " + d);
        var courses = JSON.parse(d);

        courses.forEach((c, index) => {
            if ((c.id).toString().includes(course.id) || (c.id) == (course.id)) {
                var cscore = c.enrollments[0].computed_current_score;
                var fscore = c.enrollments[0].computed_final_score;

                var score = cscore || fscore;
                callback(score)
                return;
            }
        });

    });
};
User.prototype.getGrade = getGrade;


function getGradeOLD(intent, session, callback) {
    let favoriteColor;
    const repromptText = null;
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';
    console.log("hello")
    speechOutput = "i failed"

    var course = 130000001222598;
    //Get single submission
    //https://canvas.instructure.com/doc/api/submissions.html#method.submissions_api.show
    // /api/v1/courses/:course_id/assignments/:assignment_id/submissions/:user_id
    var baseURL = "canvas.instructure.com";
    var userID = "130000004040697";
    var access_token = "?access_token=13~Rd735JtbD2tHTfc8YUlHR1VCShLx8nMAicDdBRfUOif7XK3N5DJELRlFQ8ICwNx5";
    var token = "13~Rd735JtbD2tHTfc8YUlHR1VCShLx8nMAicDdBRfUOif7XK3N5DJELRlFQ8ICwNx5";

    var url = 'https://canvas.instructure.com/api/v1/courses/130000001222598/assignments/130000004953928/submissions/130000004040697/?access_token=13~Rd735JtbD2tHTfc8YUlHR1VCShLx8nMAicDdBRfUOif7XK3N5DJELRlFQ8ICwNx5';

    matchEnrollments(token, function(d) {
        console.log(d);
    })
};

'use strict';
var https = require('https');
var User = require('./canvasConnection');
var storage = require('./storage');

var alexa = require('alexa-app');
var app = new alexa.app('CanvasGradie');

app.intent('GetGradeIntent', {
        "slots": [{
            "name": "ClassName",
            "type": "LIST_OF_CLASSES"
        }],
        "utterances": ["GetGradeIntent what grades",
            "GetGradeIntent what is my grade in {ClassName} class",
            "GetGradeIntent what is my current grade in {ClassName} class",
            "GetGradeIntent what is my grade in {ClassName}",
            "GetGradeIntent what is my current grade in {ClassName}",
        ]

        // "slots": {
        //     "number": "NUMBER"
        // },
        // "utterances": ["say the number {1-100|number}"]
    },
    function(request, response) {
        var number = request.slot('ClassName');
        // console.log(this.data.session.user.userId)
        console.log(request.sessionDetails)
            // console.log(request.sessionDetails.accessToken)

        var accessToken = request.sessionDetails.accessToken;
        console.log("TOKEN: " + accessToken)
        if (accessToken) {
            var token = accessToken;

            var req = https.request({
                host: 'api.amazon.com',
                path: '/user/profile?access_token=' + token,
                method: "GET"
            }, function(res) {
                // console.log('STATUS: ' + res.statusCode);
                // console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    console.log('BODY: ' + chunk);
                    res.removeAllListeners('data');
                    var account = JSON.parse(chunk)
                        //name, email, user_id
                    console.log(account)
                    response.say(account.name + ". You asked for the class " + number);
                    response.send()
                });
            }).end();
        } else {
            response.say("Please link your account.");
            response.send()
            response.linkAccount();
        }
        //just do it
        return false;
        // if (session.getUser().getAccessToken() == undefined) {
        //     this.emit(':tellWithLinkAccountCard', 'to start using this skill, please use ' +
        //         'the companion app to authenticate on Amazon ');
        //     return;
        // }
        // this.emit(':tellWithLinkAccountCard', 'to start using this skill, please use ' +
        //     'the companion app to authenticate on Amazon ');
        // response.linkAccount().shouldEndSession(true).say('Your Twitter account is not linked.
        //        Please use the Alexa app to link the account.');
        // var x = new User();
        // console.log("----------------")

        // console.log("----------------")
        //     // x.getGrade(null, null, null);
        // x.findCourse(intent.slots.ClassName.value, function(y) {
        //     console.log("---------------" + y);
        //     if (!Array.isArray(y)) {
        //         x.getGrade(y, function(q) {
        //             var stringResult = "Your current grade in " + y.meta.title + " is " + q + " percent.";
        //             callback(sessionAttributes,
        //                 buildSpeechletResponse(intent.name, stringResult, repromptText, shouldEndSession));
        //         });
        //     } else {
        //         var stringResult = "I could not tell what course, did you mean:"
        //         var cnt = 1;
        //         var match
        //         for (match of y) {
        //             stringResult += cnt++ + " " + match.item.meta.title;
        //         }
        //         callback(sessionAttributes,
        //             buildSpeechletResponse(intent.name, stringResult, repromptText, shouldEndSession));
        //     }
        // });

    }
);
// connect to lambda
exports.handler = app.lambda();

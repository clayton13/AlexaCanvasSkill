'use strict';
var storage = require('../storage');
var User = require('../tools/CanvasUser');
var util = require('util');

function isEmptyObject(obj) {
    if ((typeof(obj) !== 'undefined') && (obj !== null)) {
        return !Object.keys(obj).length;
    } else
        return true;
}

function requireLogin(req, res, next) {
    if (isEmptyObject(req.session.user)) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = function(app) {
    app.get('/logout', function(req, res) {
        console.log("------------------")
        console.log(JSON.stringify(req.session))
        if (req.session) {
            // req.session.destroy();
            req.session.user = {};
            // req.session.regenerate(function(err) {
            req.session.message = {};
            // req.session.message = true;
            // res.session.message.text = "Sucessfully loogged out";
            // res.session.message.alertType = "warning";
            req.session.message.text = "Sucessfully logged out";
            req.session.message.alertType = "warning";
            // })
        }
        res.redirect('/');
    });

    app.get('/login', function(req, res) {

        var amz_account = {
            user_id: 'amzn1.account.AFJC43P5SFO7GWGOUCJSYER6O6IA',
            name: 'Clayton White',
            email: 'clwht687@gmail.com'
        };

        storage.getUser(amz_account).then(exists => {
            if (exists !== false) {
                req.session.user = exists;
                req.session.CanvasUser = new User(exists)
                    // console.log("got callback " + exists + " and " + JSON.stringify(req.session.user));
                res.redirect('/dashboard');
            } else {
                res.redirect('/?bad_login');
            }
        });
    });


    app.get('/', function(req, res) {
        // if(!isEmptyObject(res.session.user)){

        // }
        res.render('pages/index');
        // if(req.session)
        console.log(req.session.loggedOut)
        req.session.loggedOut = null;
    });


    app.put('/api/canvas/', requireLogin, function(req, res) {
        var access_token = req.body.access_token;
        var amz_account = req.session.user.user_data.amz_account;

        console.log(JSON.stringify((amz_account)))


        var canvas_account = req.session.user.user_data.canvas_account;

        var user = new User(req.session.CanvasUser);
        user.getAccount(access_token).then(cUser => {
            if (!isEmptyObject(cUser.errors) && cUser.errors[0].message === "Invalid access token.") {
                res.status(499).send('Invalid Canvas Access Token');

                if (canvas_account.valid) {

                } else {
                    canvas_account = {
                        access_token: access_token || "",
                        valid: false
                    }
                    storage.update(amz_account, "user_data.canvas_account", canvas_account).then(user => {
                        if (user !== false) {
                            console.log("saved");
                            console.log(JSON.stringify(canvas_account))
                        } else {
                            // res.redirect('/dashboard');
                        }
                    });

                }
            } else {

                req.session.user.user_data.canvas_account = {
                    access_token: access_token,
                    valid: true,
                    account: cUser
                }

                req.session.CanvasUser.user_data.canvas_account = req.session.user.user_data.canvas_account;

                storage.update(amz_account, "user_data.canvas_account", req.session.user.user_data.canvas_account).then(user => {
                    if (user !== false) {
                        console.log("saved");
                        console.log(JSON.stringify(canvas_account))

                    } else {
                        // res.redirect('/dashboard');
                    }
                });
                // console.log(canvas_account)
                //Deep clone
                canvas_account = JSON.parse(JSON.stringify(req.session.user.user_data.canvas_account));
                var length = canvas_account.access_token.length;
                if (canvas_account.access_token.length > 30) {
                    canvas_account.access_token = canvas_account.access_token.substr(0, 15) + "*".repeat(length - 15);
                }


                res.status(200).json(canvas_account)

            }
        });
    });




    app.get('/api/canvas/', requireLogin, function(req, res) {
        var access_token = req.body.access_token;
        var amz_account = req.session.user.user_data.amz_account;

        console.log(JSON.stringify((amz_account)))

        var canvas_account = req.session.user.user_data.canvas_account;
        console.log("*************")

        if (canvas_account.valid == true) {
            //Deep clone
            canvas_account = JSON.parse(JSON.stringify(canvas_account));
            var length = canvas_account.access_token.length;
            if (canvas_account.access_token.length > 30) {
                canvas_account.access_token = canvas_account.access_token.substr(0, 15) + "*".repeat(length - 15);
            }
            console.log("valid")
            console.log(canvas_account)

            res.json(canvas_account)
        } else {
            // res.sendStatus(490)
            res.json()
        }
    });

    app.post('/api/addCanvasToken/', requireLogin, function(req, res) {
        var access_token = req.body.access_token;
        var amz_account = req.session.user.user_data.amz_account;

        console.log(JSON.stringify((amz_account)))
        storage.update(amz_account, "user_data.canvas_account.access_token", access_token).then(user => {
            if (user !== false) {
                req.session.user = user.Attributes;

                console.log(req.body.access_token)
                res.redirect('/dashboard');
            } else {
                res.redirect('/dashboard');
            }
        });
    });

    app.get('/api/courses/', requireLogin, function(req, res) {
        console.log("session user")

        var canvas_account = req.session.user.user_data.canvas_account;
        if (canvas_account.valid) {

            var user = new User(req.session.CanvasUser);
            console.log("----------------")
            console.log(req.session.CanvasUser)
            console.log("----------------")

            var amz_account = req.session.user.user_data.amz_account;
            var access_token = req.session.user.user_data.canvas_account.access_token;

            var nicknames2 = [];
            user.getCourses().then(courses => {
                console.log("got courses")
                courses.forEach(function(course) {

                    var temp = {
                            "id": course.id,
                            "nickname": course.name,
                            "name": course.original_name, //|| "poop",
                            "nicknames": []
                        }
                        // console.log("\n---------------\n")
                        // console.log(course.name)
                        // req.session.user.nicknames[course.id] = req.session.user.nicknames[course.id] || [];

                    // console.log(JSON.stringify(req.session.user.nicknames[course.id]))
                    var nicknameJSON = req.session.user.nicknames[course.id];

                    if ((typeof(nicknameJSON) !== 'undefined') && (nicknameJSON !== null)) {
                        var nicknameArray = JSON.parse(nicknameJSON)
                        temp.nicknames = nicknameArray;
                    }

                    nicknames2.push(temp)

                });
                res.json(nicknames2);
            });

        } else {
            res.sendStatus(490)
        }
    });
    app.post('/api/courses/', function(req, res) {
        console.log(req.body)
        console.log(req.method)
        res.sendStatus(200);
    });

    app.use('/api/courses/:id', requireLogin, function(req, res) {
        // app.use('/api/courses/:id', function(req, res) {
        // console.log("Name " + JSON.stringify(req.session))
        // console.log("Name " + req.session.user.name)

        console.log("Id: " + req.params.id)

        var amz_account = req.session.user.user_data.amz_account;
        storage.update(amz_account, "nicknames." + req.params.id, JSON.stringify(req.body.nicknames)).then(user => {

            if ((typeof(user) !== 'undefined') && (user !== null)) {
                req.session.user = user;
                // req.session.user.nicknames = user.nicknames;
            } else {
                console.log("shit")
            }
            res.json(true);

        });

        var course = [{
            name: 'math',
            _id: 1234,
            nicknames: [{
                nickname: "three"
            }, {
                nickname: "two"
            }, {
                nickname: "one"
            }]
        }];


    });

    app.get('/about', function(req, res) {
        res.render('pages/about');
    });

    app.get('/privacy', function(req, res) {
        res.render('pages/privacy');
    });


    app.use('/dashboard', requireLogin, function(req, res) {

        res.render('pages/dashboard');
    });
};

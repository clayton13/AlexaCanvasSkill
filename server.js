'use strict';
var https = require('https');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var storage = require('./storage');
var lex = require('letsencrypt-express').create({
    server: 'https://acme-v01.api.letsencrypt.org/directory',
    email: 'clwht687@gmail.com',
    agreeTos: true,
    approveDomains: ['canvasskill.tk', "www.canvasskill.tk"],

})

// handles acme-challenge and redirects to https
require('http').createServer(lex.middleware(require('redirect-https')())).listen(8080, function() {
    console.log("Listening for ACME http-01 challenges on", this.address());
});

var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.all('*', function(req, res, next) {
    console.log("Param " + JSON.stringify(req.params));
    console.log("Query " + JSON.stringify(req.query));
    console.log("Body " + JSON.stringify(req.body));
    next();
});
app.use('/test', function(req, res) {
    res.end('Hello, World!<br />HI Genny');
})


app.post('/auth', function(req, _res) {
    var token = req.body.access_token;
    // console.log(req.query);
    // var data = JSON.parse(req.query)
    // var token = req.query.access_token;
    // console.log(req.query.access_token)
    var options = {
        host: 'canvas.instructure.com',
        path: '/api/v1/users/self/profile/?access_token=' + token,
        method: "GET"
    };

    var req = https.request(options, function(res) {
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            switch (res.statusCode) {
                case 200:
                    // _res.send(
                case 401:
                default:

            }
            console.log('BODY: ' + chunk);
            console.log(JSON.parse(chunk).id)
            res.removeAllListeners('data');
            _res.send('You sent the name "' + token + '".' + res.statusCode + " " + JSON.stringify(JSON.parse(chunk)));
            // _res.redirect('/welcome/welcome.html?data=' + chunk);
        });
    }).end();

    // res.send('You sent the name "' + req.body.access_token + '".');
});

app.use("/", function(req, res, next) {
    if (req.query.client_id === "amzn1.application-oa2-client.f923b7a941514fa390dfbff4be669a5e") {
        var data = querystring.stringify({
            state: req.query.state,
            // access_token: 'var',
            // token_type: 'Bearer',
            // response_type: 'token',
            code: "adsfasdfasdf"
        })
        console.log(req.query.redirect_uri + "/&" + data)
        res.redirect(req.query.redirect_uri + "/&" + data);
    } else {
        next()
    }
})
app.use(express.static('public/'))

// app.use('/welcome', express.static('public/welcome'))
app.get('/welcome', function(req, _res) {
    console.log(req.query);
    var token = req.query.access_token;

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
            _res.redirect('/welcome/welcome.html?data=' + chunk);

            var amz_account = JSON.parse(chunk)
            console.log(amz_account)
                // storage.getUser(amz_account, function(exists){
                //     console.log("got callback " + exists + " and " + JSON.stringify(this));
                // })
                // storage.putUser(amz_account, function(exists) {
                //     console.log("got callback " + exists + " and " + JSON.stringify(this));
            var date = new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: "numeric",
                minute: "numeric",
                timeZone: "America/New_York",
                timeZoneName: "short"
            });

            storage.update(amz_account, "user_data.timestamp.lastUpdate", date, function() {});
            storage.update(amz_account, "user_data.timestamp.creationDate", date, function() {});
            // })
        });
    }).end();


    // res.redirect('/welcome/welcome.html')

    // res.sendStatus(200);
});

// app: require('express')().use('/')
//app: (require('express')().static('/'))

var AmazonTokenStrategy = require('passport-amazon-token');
var passport = require("passport")
passport.use(new AmazonTokenStrategy({
    clientID: "amzn1.application-oa2-client.f923b7a941514fa390dfbff4be669a5e",
    clientSecret: "069d25f6a7552612d8fd0b7e9ad518ca18729348dd7426b707c436416fe7a47e",
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, next) {
    console.log(profile)
    return next(error, user);
    User.findOrCreate({
        'amazon.id': profile.id
    }, function(error, user) {
        console.log(user)
        return next(error, user);
    });
}));

app.get('/auth/amazon', passport.authenticate('amazon-token'));


// handles your app
require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(8443, function() {
    console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
});

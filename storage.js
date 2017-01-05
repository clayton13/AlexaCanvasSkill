'use strict';
var AWS = require("aws-sdk");
var Promise = require("bluebird");
//"C:/Users/Clayton/Desktop/GitHub/AlexaCanvasSkill" +
//https://s3.amazonaws.com/canvasskillbucket/myzip.zip
AWS.config.loadFromPath(__dirname + '/config.json');
AWS.config.setPromisesDependency(require('bluebird'));
var table = "CanvasData";
var globals = require('./globals');
var https = require('https');
var querystring = require('querystring');

var rp = require('request-promise');
// AWS.config.update({endpoint: "https://dynamodb.us-east-1.amazonaws.com"});
var ep = new AWS.Endpoint('arn:aws:dynamodb:us-east-1:708578975317:table/CanvasData');


var storage = (function() {
    // var dynamodb = new AWS.DynamoDB.DocumentClient(); //new AWS.DynamoDB({apiVersion: '2012-08-10'}); 

    return {
        getAmazonAccount: function(token) {
            var options = {
                baseUrl: 'https://api.amazon.com',
                uri: '/user/profile?access_token=' + token,
                method: 'GET'
            }
            return rp(options).then(function(res) {
                return JSON.parse(storage.jsonFix(res));
            });
        },
        //Fetches user from database
        //Returns
        //  User if exists
        //  False if nonexistant
        getUser: function(amz_account) {
            var docClient = new AWS.DynamoDB.DocumentClient();
            var params = {
                TableName: table,
                Key: {
                    "userID": amz_account.user_id,
                }
            };

            return docClient.get(params).promise().then(data => {
                if (!isEmptyObject(data.Item)) {
                    return data.Item;
                } else {
                    return false;
                }
            });
        },
        //Fetches user from database
        //Returns
        //  User if exists
        //  False if nonexistant
        putUser: function(amz_account) {
            var docClient = new AWS.DynamoDB.DocumentClient();

            var params = {
                TableName: table,
                Item: {
                    "userID": amz_account.user_id,
                    "user_data": {
                        "amz_account": amz_account,
                        "canvas_account": {},
                        "timestamp": {}
                    },
                    'nicknames': {}
                }
            };

            return docClient.put(params).promise().then(data => {
                //put user not returning newly created user correctly, just return orig Item.
                return params.Item;
            });
        },
        //Get user if exits otherwise create one
        getOrPutUser: function(amz_account) {
            return this.getUser(amz_account).then(exists => {
                if (exists !== false) {
                    console.log("Got user");
                    return exists;
                } else {
                    console.log("Created user");
                    return this.putUser(amz_account).then(exists => {
                        return exists;
                    });
                }
            });
        },
        //Updates a given key
        //TODO: optimize for mulitple updates
        update: function(amz_account, key, value) {
            //ie data.timestamp.lastUpdate

            var x = {
                "user_data": {
                    "timestamp": {
                        "adsfsadf": "asldfnalskdfnasld;fnasldkfn",
                    }
                }
            }

            //Quirqy workaboud for dynamic attr updates 
            //  See: https://github.com/aws/aws-sdk-go/issues/759
            var attrs = key.split(".");
            var uExpression = "";
            var attrNames = {}
            for (var i = 0; i < attrs.length; i++) {
                if (i != 0)
                    uExpression += ".";
                uExpression += "#key" + i;
                attrNames["#key" + i] = attrs[i];
            }

            var docClient = new AWS.DynamoDB.DocumentClient();
            var params = {
                TableName: table,
                Key: {
                    "userID": amz_account.user_id,
                },
                UpdateExpression: "set " + uExpression + " = :val",
                ExpressionAttributeNames: attrNames,
                ExpressionAttributeValues: {
                    ":val": value
                },
                ReturnValues: "ALL_NEW", //UPDATED_NEW"
            };

            return docClient.update(params).promise().then(data => {
                console.log("Update> ", data.Attributes);
                if (!isEmptyObject(data.Attributes)) {
                    return data.Attributes;
                } else {
                    return false;
                }
            });
        },
        jsonFix: function(json) {
            return json.replace(/([\[:])?(\d{10,})([,\}\]])/g, "$1\"$2\"$3");
        },
        //Makes a put request to canvas
        makePUT: function(path, data, token) {
            var options = {
                baseUrl: globals.BASE_URL,
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
                uri: path,
                method: 'PUT',
                form: data
            }
            return rp(options).then(function(res) {
                // console.log(JSON.stringify(res));
                return JSON.parse(storage.jsonFix(res));
            });
        },

        makeGET: function(path, data, token) {
            var options = {
                baseUrl: globals.BASE_URL,
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
                uri: path,
                method: 'GET',
                useQuerystring: true,
                qs: data
            }


            return rp(options).then(function(res) {
                // console.log(JSON.stringify(res));
                return JSON.parse(storage.jsonFix(res));
            });

        }
    };
})();
module.exports = storage;

// storage.loadGame(null, null)
function isEmptyObject(obj) {
    if ((typeof(obj) !== 'undefined') && (obj !== null)) {
        return !Object.keys(obj).length;
    } else
        return true;
}




// var x = {
//     "userID": "123231412",
//     "test": "hello"
// }
// storage.getUser(amz_account, function(u) {
//     var user = new User(u)
// });

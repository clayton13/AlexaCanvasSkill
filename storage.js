'use strict';
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var table = "CanvasData";

// AWS.config.update({endpoint: "https://dynamodb.us-east-1.amazonaws.com"});
var ep = new AWS.Endpoint('arn:aws:dynamodb:us-east-1:708578975317:table/CanvasData');
// AWS.config.update({
//     // aws_access_key_id: 'AKIAIQEVTQGG7LOXXPBA',
//     // aws_secret_access_key: '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',
//     // region: "us-east-1",
//     endpoint:ep // "arn:aws:dynamodb:us-east-1:708578975317:table/CanvasData"
// });

var storage = (function() {
    // var dynamodb = new AWS.DynamoDB.DocumentClient(); //new AWS.DynamoDB({apiVersion: '2012-08-10'}); 

    return {
        //Fetches user from database
        //Returns
        //  User if exists
        //  False if nonexistant
        getUser: function(amz_account, callback) {
            try {
                var docClient = new AWS.DynamoDB.DocumentClient();
                var params = {
                    TableName: table,
                    Key: {
                        "userID": amz_account.user_id,
                    }
                };

                docClient.get(params, function(err, data) {
                    if (err) {
                        console.log(err);
                        callback(false);
                    } else {
                        console.log("> " + JSON.stringify(data));
                        if (isEmptyObject(data)) {
                            callback(data)
                        } else {
                            callback(false)
                        }
                    }
                });
            } catch (error) {
                console.log("TRY Catch " + error)
                callback(false)
            }
        },
        //Fetches user from database
        //Returns
        //  User if exists
        //  False if nonexistant
        putUser: function(amz_account, callback) {
            try {
                var docClient = new AWS.DynamoDB.DocumentClient();

                var params = {
                    TableName: table,
                    Item: {
                        "userID": amz_account.user_id,
                        "user_data": {
                            "amz_account": amz_account
                        }
                    }
                };

                docClient.put(params, function(err, data) {
                    if (err) {
                        console.log(err);
                        callback(false);
                    } else {
                        console.log("> " + JSON.stringify(data, null, ' '));
                        if (isEmptyObject(data)) {
                            callback(data)
                        } else {
                            callback(false)
                        }
                    }
                });
            } catch (error) {
                console.log("TRY Catch " + error)
                callback(false)
            }
        },
        //Updates a given key
        //TODO: optimize for mulitple updates
        update: function(amz_account, key, value, callback) {
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
            for (var i = 0; i < 3; i++) {
                if (i != 0)
                    uExpression += "."
                uExpression += "#key" + i;
                attrNames["#key" + i] = attrs[i]
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
                ReturnValues: "UPDATED_NEW"
            };
            docClient.update(params, function(err, data) {
                if (err) {
                    console.log(err);
                    callback(false);
                } else {
                    console.log("Update> " + JSON.stringify(data, null, ' '));
                    if (isEmptyObject(data)) {
                        callback(data)
                    } else {
                        callback(false)
                    }
                }
            });
        },
        loadGame: function(session, callback) {
            try {
                AWS.config.update({
                    //   region: "us-west-2",
                    //   endpoint: "http://localhost:8000"
                });

                var dynamodb = new AWS.DynamoDB.DocumentClient(); //new AWS.DynamoDB();

                // var params = {
                //     TableName : "Movies",
                //     KeySchema: [       
                //         { AttributeName: "year", KeyType: "HASH"},  //Partition key
                //         { AttributeName: "title", KeyType: "RANGE" }  //Sort key
                //     ],
                //     AttributeDefinitions: [       
                //         { AttributeName: "year", AttributeType: "N" },
                //         { AttributeName: "title", AttributeType: "S" }
                //     ],
                //     ProvisionedThroughput: {       
                //         ReadCapacityUnits: 10, 
                //         WriteCapacityUnits: 10
                //     }
                // };

                // dynamodb.createTable(params, function(err, data) {
                //     if (err) {
                //         console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                //     } else {
                //         console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                //     }
                // });
                //  } catch (error) {
                //     context.fail("Caught: " + error);
                //   }
                var table = "CanvasData";

                var year = 2015;
                var title = "The Big New Movie";
                var x = new Object()
                x.var = "hello";
                x.var2 = "world";
                x.list = ["h", "e", "l", "l", "o"];

                var params = {
                    TableName: table,
                    Item: {
                        "userID": "123231412",
                        "test": "hello",
                        "data": x
                    }
                };
                console.log("Adding a new item...");
                dynamodb.put(params, function(err, data) {
                    if (err) {
                        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Added item:", JSON.stringify(data, null, 2));
                    }
                });
            } catch (error) {
                console.log(error)
                    // context.fail("Caught: " + error);
            }
        }
    }
})();
module.exports = storage;

// storage.loadGame(null, null)
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

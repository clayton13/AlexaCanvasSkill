var User = require('./canvasConnection');

var x = new User();

// x.getGrade(null, null, null);


x.findCourse("calculus", function(y) {
    console.log("---------------" + y);
    if (!Array.isArray(y)) {
        x.getGrade(y, function(q) {
            var stringResult = "Your current grade in " + y.meta.title + " is " + q + " percent.";
            console.log(stringResult);
        });
    } else {
        var stringResult = "I could not tell what course, did you mean:"
        var cnt = 1;
        var match
        for (match of y) {
            stringResult += cnt++ + " " + match.item.meta.title;
        }
        console.log(stringResult);
    }
});

var token = "13~Rd735JtbD2tHTfc8YUlHR1VCShLx8nMAicDdBRfUOif7XK3N5DJELRlFQ8ICwNx5";
//"include[]:total_scores"
//130000001209068
//x.makeGET("/api/v1/courses/" + 1223015 + "/", null , token, function(q){console.log(q)});


// var obj = new Object();
// obj.id = 1223015;
//  x.getGrade(obj, function(q){console.log(q)})

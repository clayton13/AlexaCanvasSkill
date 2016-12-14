// Merely parses raw text file and spits into courses based on the regex header
//  ie: MAE 2801 ED-TL&L 4(3,1)
//  then places into array and saves.

var fs = require('fs');

const rawTitleRegex = /^([A-Z]{3} [^ ]{4,5}[A-Z]{0,1}) ([^ ].*[^ ]) ([0-9]|VAR).*\)$(?=\n[A-Z])/mg;

var str = fs.readFileSync('ucfCourseRawData.txt', 'utf8');

var courses = [];
var data;

var lastIndex = 0;
while ((data = rawTitleRegex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (data.index === rawTitleRegex.lastIndex) {
        rawTitleRegex.lastIndex++;
    }

    //Set desc on previous course
    if (courses.length > 0) {
        var pCourse = courses[courses.length - 1];

        var pNameEnd = pCourse.lastIndex;
        var desc = str.substring(pNameEnd, data.index);

        pCourse.rawInfo = desc;
    }

    data.forEach((m, groupIndex) => {
        data[groupIndex] = cleanupString(m);
    })

    var match = data;
    var c = new Object()
    c.name = match[1];
    c.lastIndex = data.index + data[0].length;
    c.college = match[2];
    c.credits = match[3];


    courses.push(c);
}

//Last item, set desc from title onward til end
var pCourse = courses[courses.length - 1];
var pNameEnd = pCourse.lastIndex;
var desc = str.substring(pNameEnd);
pCourse.rawInfo = desc;


var stream = fs.createWriteStream("ucfCourseData.json");
stream.once('open', function(fd) {
    stream.write(JSON.stringify(courses));
    stream.end();
    process.exit();
});

//Remove whitespace and newlines
function cleanupString(str) {
    return ((str.replace(/\r?\n|\r|\n/g, " ")).replace(/(  )/gm, " ")).trim();
}
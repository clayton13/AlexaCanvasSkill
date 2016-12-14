var fs = require('fs');

const regex = /^(([A-Z]{3} [^ ]*) ([^ ].*[^ ]) ([0-9]|VAR).*\))([\s\S]+?):[\s]*PR:/mg;
const rawTitleRegex = /^([A-Z]{3} [^ ]{4,5}[A-Z]{0,1}) ([^ ].*[^ ]) ([0-9]|VAR).*\)$(?=\n[A-Z])/mg;
// old ^([A-Z]{3} [^ ]*) ([^ ].*[^ ]) ([0-9]|VAR).*\)$/mg;
var str = fs.readFileSync('ucfCourseRawData.txt', 'utf8');

var courses = [];
var data;

var c = new Object()
c.rawInfo = "";
c.name = "";
c.title = "";
c.credits = "";
c.college = "";

var lastIndex = 0;
while ((data = rawTitleRegex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (data.index === rawTitleRegex.lastIndex) {
        rawTitleRegex.lastIndex++;
    }

    if (courses.length > 0) {
        console.log("``````````````````````````````````````````")
            //Previous course
        var pCourse = courses[courses.length - 1];
        console.log(pCourse)
        var pNameEnd = pCourse.lastIndex;
        var desc = str.substring(pNameEnd, data.index);
        console.log(desc)
        pCourse.rawInfo = desc;
        // courses[courses.size-1].title =  
        console.log("---")
        console.log(JSON.stringify(pCourse))
        console.log("---")
    }

    // var match = data[1].split(/\r?\n/);
    data.forEach((m, groupIndex) => {
        data[groupIndex] = ((m.replace(/\r?\n|\r|\n/g, " ")).replace(/(  )/gm, " ")).trim();
        //  console.log(`Found match, group ${groupIndex}: ${m}`);
    })
    console.log("-" + data[0] + "-")
    var match = data;
    var c = new Object()
        // c.rawInfo = match[0];
    c.name = match[1];
    console.log("*************** " + data.index + " *************************")
    c.lastIndex = data.index + data[0].length;
    // c.title = match[5];
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
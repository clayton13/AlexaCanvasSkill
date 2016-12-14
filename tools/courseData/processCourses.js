// Parses json output from getCourses.js and furter processes the data
//  finds the title and begins to process the pr and cr sections.

//Gets the tile and pr for those with the : PR: pattern
const prRegex = /(^[\s\S]*?):[\s]*(PR:|CR:)([\s\S]+?)\.(?!\d)/gm;

var fs = require('fs');
var courses = JSON.parse(fs.readFileSync('ucfCourseData.json', 'utf8'));

courses.forEach((course, index) => {

    var rawInfo = course.rawInfo;
    var raw = " ";

    while ((raw = prRegex.exec(rawInfo)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (raw.index === prRegex.lastIndex) {
            prRegex.lastIndex++;
        }
        raw.forEach((m, groupIndex) => {
            raw[groupIndex] = cleanupString(m)
        });

        course.title = raw[1];
        course.pr = raw[3];
        console.log(course.pr);
        delete course.lastIndex;
    }
});

courses.forEach((course, index) => {

    var rawInfo = course.rawInfo;
    var raw = " ";

    if (!course.hasOwnProperty("pr")) {
        var s = cleanupString(course.rawInfo);

        var noprRegex = /(^[\s\S]*?):/gm;
        while ((raw = noprRegex.exec(rawInfo)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (raw.index === prRegex.lastIndex) {
                prRegex.lastIndex++;
            }
            raw.forEach((m, groupIndex) => {
                raw[groupIndex] = cleanupString(m);
            });
            //plus one to get rid of colon
            var description = cleanupString(rawInfo.substring(raw.index + raw[0].length + 1));

            course.title = raw[1];
            course.description = description;
        }
    }
});

var stream = fs.createWriteStream("ucfCourseDataFinal.json");
stream.once('open', function(fd) {
    stream.write(JSON.stringify(courses));
    stream.end();
    process.exit();
});


//Remove whitespace and newlines
function cleanupString(str) {
    return ((str.replace(/\r?\n|\r|\n/g, " ")).replace(/(  )/gm, " ")).trim();
}

const regex = /[\s](.*([\s]).*)(: PR:)/g;
//Gets the tile and pr for those with the : PR: pattern
const prRegex = /(^[\s\S]*?):[\s]*(PR:|CR:)([\s\S]+?)\.(?!\d)/gm;
// old /(^[\s\S]*?):[\s]*PR:([\s\S]+?)\.(?!\d)/gm;

var fs = require('fs');
var courses = JSON.parse(fs.readFileSync('ucfCourseData.json', 'utf8'));

courses.forEach((course, index) => {

    var rawInfo = course.rawInfo;
    var raw = " ";
    // console.log(rawInfo)
    while ((raw = prRegex.exec(rawInfo)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (raw.index === prRegex.lastIndex) {
            prRegex.lastIndex++;
        }
        raw.forEach((m, groupIndex) => {
            raw[groupIndex] = ((m.replace(/\r?\n|\r|\n/g, " ")).replace(/(  )/gm, " ")).trim();
            //  console.log(`Found match, group ${groupIndex}: ${m}`);
        });

        // console.log(" -\n" + raw[1] + " \n" + raw[2])

        course.title = raw[1];
        course.pr = raw[3];
        console.log(course.pr)
        delete course.lastIndex;
        // delete course.rawInfo;
        // console.log(course)
    }
});

courses.forEach((course, index) => {

    var rawInfo = course.rawInfo;
    var raw = " ";

    if (!course.hasOwnProperty("pr")) {
        var s = ((course.rawInfo).replace(/\r?\n|\r|\n/g, " ")).replace(/(  )/gm, " ").trim()

        // console.log(s);
        var noprRegex = /(^[\s\S]*?):/gm;
        while ((raw = noprRegex.exec(rawInfo)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (raw.index === prRegex.lastIndex) {
                prRegex.lastIndex++;
            }
            raw.forEach((m, groupIndex) => {
                raw[groupIndex] = cleanupString(m)
            });
            //plus one to get rid of colon
            var description = cleanupString(rawInfo.substring(raw.index + raw[0].length + 1));

            // console.log(" -\n" + raw[1] + " \n" + description)

            course.title = raw[1];
            course.description = description;
            // course.pr = raw[2];
            // delete course.lastIndex;
            // delete course.rawInfo;
            // console.log(course)
        }
    }
});

var stream = fs.createWriteStream("ucfCourseDataFinal.json");
stream.once('open', function(fd) {
    stream.write(JSON.stringify(courses));
    stream.end();
    process.exit();
});


function cleanupString(str) {
    return ((str.replace(/\r?\n|\r|\n/g, " ")).replace(/(  )/gm, " ")).trim();
}

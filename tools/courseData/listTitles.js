// Parses json output main database and then extracts the 
//  titles from it and saves it to courseTitles.txt.

var fs = require('fs');
var courses = JSON.parse(fs.readFileSync('ucfCourseDataFinal.json', 'utf8'));

var titles = "";
courses.forEach((course, index) => {
    var title = cleanupString(course.title);
    console.log(title);
    titles += title + "\n";
});

var stream = fs.createWriteStream("courseTitles.txt");
stream.once('open', function(fd) {
    stream.write(titles);
    stream.end();
    process.exit();
});



//Remove whitespace and newlines
function cleanupString(str) {
    return ((str.replace(/\r?\n|\r|\n/g, " ")).replace(/(  )/gm, " ")).trim();
}

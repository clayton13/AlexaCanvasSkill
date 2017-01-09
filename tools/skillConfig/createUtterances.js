'use strict';
const intentUtteranceExpander = require('intent-utterance-expander');

//Creates utterances.txt containing the utterances used for the skill config
var all = [];
var utterances = [
    "GetHowWellIntent ( |get|tell me) how ( |bad|great|well) am I doing ",
    "GetHowWellIntent ( |get|tell me) how my grades are ( |coming|coming along|doing)",
    "GetHowWellIntent ( |get|tell me) how (I am|I'm) doing",
    "GetHowWellIntent ( |get|tell me) how are my grades",
    "GetHowWellIntent my (|current) grades",
    "",
    "GetGradeIntent ( |what is|what's|get|tell me) my (|current) grade (in|for)  {ClassName} (|class)",
    "GetGradeIntent ( |what is|what's|get|tell me) my (|current) {ClassName} (|class) grade",
    "GetGradeIntent ( |get|tell me) what my (|current) grade (in|for)  {ClassName} (|class) is",
    "GetGradeIntent ( |get|tell me) what my (|current) {ClassName} (|class) grade is",
    "GetGradeIntent ( |get|tell me) ( |what) my (|current) grade (in|for)  {ClassName} (|class) (|is)",
    // "GetGradeIntent ( |what are|what) my (|current) grades (|are)",
    "",
    //assignments
    "GetLastAssignmentsIntent ( |get|tell me) what (are|were) the last {numberOfAssignments} (|graded) assignments (in|for|from) {ClassName} (|class)",
    "GetLastAssignmentsIntent ( |get|tell me) ( |what is|what's) the last {numberOfAssignments} (|graded) assignments (in|for|from) {ClassName} (|class)",
    //grades
    "GetLastAssignmentsIntent ( |get|tell me) what (are|were) the last {numberOfAssignments} (|grades) (in|for|from) {ClassName} (|class)",
    "GetLastAssignmentsIntent ( |get|tell me) ( |what is|what's) the last {numberOfAssignments} (|grades) (in|for|from) {ClassName} (|class)",
    "",
    "GetUpcommingEventsIntent ( |get|tell me) what are (my|the) upcoming events",
    "GetUpcommingEventsIntent ( |get|tell me) (my|the) upcoming events",
    "GetUpcommingEventsIntent ( |get|tell me) what events (|that) are (upcoming|coming up)",
    "GetUpcommingEventsIntent ( |get|tell me) do I have (|any) upcoming events",
    "GetUpcommingEventsIntent ( |get|tell me) do I have (|any) events (|that) are (upcoming|coming up)",
    "GetUpcommingEventsIntent ( |get|tell me) (what's|what is) upcoming",
    "",
    "GetNumberIntent ( |class|number|class number) {number}",
    // "GetLastAssignmentsIntent what (are|were) the last {numberOfAssignments} graded assignments (in|for|from) {ClassName} (|class)?"
];

for (let utterance of utterances) {
    all = all.concat(intentUtteranceExpander(utterance));
}


var file = require('fs').createWriteStream('utterances.txt');
for (let utterance of all) {
    // Remove double spaces and spaces before question marks
    utterance = utterance.replace(/  +/g, ' ').replace(/\s+([?])/g, "$1");
    file.write(utterance + "\n");
}
file.end();

//For when Skill is not linked to Amazon Account, usually handled
function NotLinkedError(message) {
    this.message = message;
    this.name = "NotLinkedError";
    Error.captureStackTrace(this, NotLinkedError);
}
NotLinkedError.prototype = Object.create(Error.prototype);
NotLinkedError.prototype.constructor = NotLinkedError;
exports.NotLinkedError = NotLinkedError;

//For when a bad error is predictable and you want to send a better message to the user
function PresentableError(message, orig) {
    this.message = message;
    this.name = "PresentableError";
    this.orig = orig || null;
    Error.captureStackTrace(this, PresentableError);
}
PresentableError.prototype = Object.create(Error.prototype);
PresentableError.prototype.constructor = PresentableError;
exports.PresentableError = PresentableError;

//Wrapper for handled errors, errors that require no more action, already handled elsewhere
function HandledError(message, orig) {
    this.message = message;
    this.name = "HandledError";
    this.orig = orig || null;
    Error.captureStackTrace(this, HandledError);
}
HandledError.prototype = Object.create(Error.prototype);
HandledError.prototype.constructor = HandledError;
exports.HandledError = HandledError;

//Make request promise errors accessible
exports.Request = require('request-promise/errors');

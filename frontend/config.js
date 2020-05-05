let ROOT = "http://ec2-18-223-30-20.us-east-2.compute.amazonaws.com:3000/";

exports.ROOT = ROOT;
exports.LOGIN = ROOT + "login";
exports.REPORT = ROOT + "report";
exports.TEST = ROOT + "test";
let typeCount = {
    'ARSON': 0,
    'ASSAULT': 0,
    'BATTERY': 0,
    'BURGLARY': 0,
    'CRIM SEXUAL ASSAULT': 0,
    'CRIMINAL DAMAGE': 0,
    'CRIMINAL TRESPASS': 0,
    'DECEPTIVE PRACTICE': 0,
    'INTERFERENCE WITH PUBLIC OFFICER': 0,
    'MOTOR VEHICLE THEFT': 0,
    'NARCOTICS': 0,
    'OBSCENITY': 0,
    'OFFENSE INVOLVING CHILDREN': 0,
    'OTHER OFFENSE': 0,
    'ROBBERY': 0,
    'THEFT': 0,
    'WEAPONS VIOLATION': 0,
}
exports.typeCount = typeCount;

let buttonNames = ['HOMICIDE', 'THEFT', 'BATTERY', 'CRIMINAL DAMAGE', 'NARCOTICS', 'ASSAULT', 'ARSON', 'BURGLARY']
exports.buttonNames = buttonNames;

let iconNames = ['knife', 'drupal', 'kabaddi', 'home-alert', 'tea', 'karate', 'fire', 'garage-alert']
exports.iconNames = iconNames;

let attachments = [];
exports.attachments = attachments;
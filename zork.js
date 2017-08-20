var spawn = require('child_process').spawn;
var path = require('path');
var files = require('./files.js');

// TODO - validate conversation / user ids for injection?
exports.doReturningUserLook = function(app) {
    doCommand(app, true);
}
exports.handleInput = function(app) {
    doCommand(app, false);
}

function doCommand(app, isReturningUserLook) {
    var command = isReturningUserLook ? "look" : app.getRawInput();

    command = command.replace(/(south|north).?(east|west)/i, "$1 $2");
    var save_file = files.getUserSaveFile(app);

    // Zork needs to be run in its own directory for file dependencies
    var zork = spawn('./zork', [save_file, command], {cwd: path.normalize('./zork')});

    zork.stdout.on('data', (data) => {
        var response = data.toString();

        if (isReturningUserLook) {
            response = `Welcome back to dungeon. ${response}`;
        }

        if (response.includes('I don\'t understand that.')) {
            response = `${response} I thought you said, "${command}". Returning to game.`;
        }

        response = response + ' <break time="1s"/>What do you do next?';
        app.askSSML(response);
    });

    zork.stderr.on('data', (data) => {
        app.tell(data.toString());
    });
}

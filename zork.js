'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var files = require('./files.js');

// TODO - validate conversation / user ids for injection
// TODO - delete tmp files on conversation end
module.exports = function (app) {
    var input = app.getRawInput();
    input = input.replace(/(south|north).?(east|west)/i, "$1 $2");
    var save_file = files.getUserSaveFile(app);

    // Zork needs to be run in its own directory for file dependencies
    var zork = spawn('./zork', [save_file, input], {cwd: path.normalize('./zork')});

    zork.stdout.on('data', (data) => {
        var response = data.toString();

        if (response.includes('I don\'t understand that.')) {
            response = `${response} I thought you said, "${input}". Returning to game.`;
        }

        response = response + ' <break time="1s"/>What do you do next?';
        app.askSSML(response);
    });

    zork.stderr.on('data', (data) => {
        app.tell(data.toString());
    });
}

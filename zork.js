'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var files = require('./files.js');

// TODO - validate conversation / user ids for injection
// TODO - delete tmp files on conversation end
module.exports = function (app) {
    var input = app.getRawInput();
    var save_file = files.getConversationSaveFile(app);

    // Zork needs to be run in its own directory for file dependencies
    var zork = spawn('./zork', [save_file, input], {cwd: path.normalize('./zork')});

    zork.stdout.on('data', (data) => {
        app.ask(data.toString());
    });

    zork.stderr.on('data', (data) => {
        app.tell('Sorry, something went wrong. Try again later.');
        console.log(`ps stderr: ${data}`);
    });
}

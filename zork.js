var spawn = require('child_process').spawn;
var path = require('path');
var files = require('./files.js');
var reading = require('./reading.js');

const WRONG_LAST_TIME_KEY = 'wrong_last_time';

exports.doReturningUserLook = function(app) {
    doCommand(app, true);
}
exports.handleInput = function(app) {
    doCommand(app, false);
}

// TODO - validate commands for injection?
function doCommand(app, isReturningUserLook) {
    var command = isReturningUserLook ? "look" : app.getRawInput();
    var dialogue_state = app.getDialogState();

    command = command.replace(/(south|north).?(east|west)/i, "$1 $2");
    var save_file = files.getUserSaveFile(app);

    // Zork needs to be run in its own directory for file dependencies
    var zork = spawn('./zork', [save_file, command], {cwd: path.normalize('./zork')});

    zork.stdout.on('data', (data) => {
        var response = data.toString();

        if (isReturningUserLook) {
            response = `Welcome back to dungeon. Please send any requests or complaints to dungeon rpg 99 at gmail dot com. ${response}`;
        }

        if (response.includes('I don\'t understand that.')) {
            if (dialogue_state[WRONG_LAST_TIME_KEY]) {
                response = `${response} I thought you said, "${command}". Dungeon is an old game that only understands simple commands.  If you haven't played before, we recommend browsinging the help section by saying help. Returning to game. What do you do next?`;
                app.askSSML(response);
            } else {
                response = `${response} I thought you said, "${command}". Returning to game. What do you do next?`;
                dialogue_state[WRONG_LAST_TIME_KEY] = true;
                app.askSSML(response, dialogue_state);
            }
        } else {
            var pages = reading.makePagesForZorkOutput(response);
            if (pages.length === 1) {
                response = response + ' <break time="1s"/>What do you do next?';
                app.askSSML(response);
            } else {
                // Note: the page handler should add "What do you do next" by itself
                dialogue_state[reading.CURRENT_PAGE_KEY] = 0;
                dialogue_state[reading.PAGES_KEY] = pages;
                app.askWithListSSML(pages[0], reading.makePagesOptions(app), dialogue_state);
            }
        }

    });

    zork.stderr.on('data', (data) => {
        app.tell(data.toString());
    });

    function killChild() {
        zork.kill('SIGINT');
        process.exit();
    }

    process.on('exit', killChild);
    process.on('SIGINT', killChild);
    process.on('uncaughtException', killChild);
}

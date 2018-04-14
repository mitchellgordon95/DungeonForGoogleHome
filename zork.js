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

    // Fix bug with one word directions not being recognized
    // Make sure to use two-letter directions since sometimes zork does not correctly interpret "south east"
    // See https://github.com/mitchellgordon95/DungeonForGoogleHome/issues/9
    command = command.replace(/((s)outh|(n)orth).?((e)ast|(w)est)/i, "$2$3$5$6")
    var save_file = files.getUserSaveFile(app);

    // Make sure we don't pass an empty string to zork / just whitespace to zork. Doing so causes
    // the process to spin forever.
    if ((!command || command.length === 0 || /^\s*$/.test(command))) {
        app.askSSML(`Sorry, I didn't understand that. What do you do next?`, dialogue_state); 
        return;
    }

    // Zork needs to be run in its own directory for file dependencies
    var zork = spawn('./zork', [save_file, command], {cwd: path.normalize('./zork')});

    zork.stdout.on('data', (data) => {
        var response = data.toString();

        if (isReturningUserLook) {
            response = `Welcome back to dungeon. Please send any requests or complaints to dungeon rpg 99 at gmail dot com. ${response}`;
        }

        if (response.includes('I don\'t understand that.')) {
            if (dialogue_state[WRONG_LAST_TIME_KEY]) {
                response = `${response} I thought you said, "${command}". Dungeon is an old game that only understands simple commands.  If you haven't played before, we recommend browsing the help section by saying help. Returning to game. What do you do next?`;
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

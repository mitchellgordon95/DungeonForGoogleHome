'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

module.exports = {
    tell: {
        'quit': 'Goodbye!'
    },
    ask: {
        'main_intent': 'Welcome to Dungeon. We recommend starting the tutorial by saying "tutorial." Otherwise, say "look" to start or "load" to load a saved game.',
        'tutorial': 'To start the game, say "look." To quit, say "quit." To save, say "save." This will overwrite your last save. To load from the last time you said save, say "load." You can come back to the tutorial at any time by saying "tutorial." To hear more, say "second tutorial."',
        // TODO - help
        'second tutorial': 'Sorry, I haven\'t had a chance to write this. Try again later.'
    },
    do: {
        'save': function(app) {
            var conversation_save_file = app.getUser().user_id + app.getConversationId();
            var user_save_file = app.getUser().user_id;

            var zork = spawn('cp', [conversation_save_file, user_save_file], {cwd: path.normalize('./zork')});
            // TODO - error handling
            // TODO - confirm.
            app.ask("Saved game.");
        },
        'load': function(app) {
            var conversation_save_file = app.getUser().user_id + app.getConversationId();
            var user_save_file = app.getUser().user_id;

            var zork = spawn('cp', [user_save_file, conversation_save_file], {cwd: path.normalize('./zork')});
            // TODO - error handling
            // TODO - confirm.
            app.ask("Loaded game.");
        }
    }
};

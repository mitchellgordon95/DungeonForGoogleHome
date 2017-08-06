'use strict';

var strings = require('./strings.js');
var spawn = require('child_process').spawn;
var files = require('./files.js');

var easy_answers = module.exports = {
    // Things we should respond to with a "tell"
    tell: {},
    // Things we should respond to with an "ask"
    ask: {},
    // Things that need doing (take ActionsSdkApp as a param)
    do: {},
    // Things that need sections
    sections: {}
};

// tell
easy_answers.tell['quit'] = 'Goodbye!';

// ask
easy_answers.ask['tutorial'] = strings.tutorial;
easy_answers.ask['info'] = strings.info;

// sections. Each key in the object is a section. Nesting works.
var talking_to_dungeon = {
    'containment': strings.containment,
    'fighting': strings.fighting,
    'actions': strings.actions,
    'command parser': strings.command_parser
};
easy_answers.sections['dungeon help'] = {
    'dungeon commands': strings.commands,
    'talking to dungeon': talking_to_dungeon
};


// do
easy_answers.do['save'] = function(app) {
    var conversation_save_file = files.getConversationSaveFile(app);
    var user_save_file = files.getUserSaveFile(app);

    spawn('cp', [conversation_save_file, user_save_file]);
    // TODO - error handling
    // TODO - confirm.
    app.askSSML("Saved game. What do you do next?");
};
easy_answers.do['restore'] = function(app) {
    var conversation_save_file = files.getConversationSaveFile(app);
    var user_save_file = files.getUserSaveFile(app);

    spawn('cp', [user_save_file, conversation_save_file]);
    // TODO - error handling
    // TODO - confirm.
    app.askSSML("Restored game. What do you do next?");
};

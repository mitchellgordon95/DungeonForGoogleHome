'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var number2words = require('number-to-words');
var files = require('./files.js');
var strings = require('./strings.js');

// Takes a long response with multiple lines and breaks it up into pages for the user.
function page(page_name, string, dict) {
    var pages = string.split("\n");
    dict[page_name] = `This text has ${number2words.toWords(pages.length)} pages. Say "${page_name} one" to go to the first page, "${page_name} two" to go to the second page, and so on.`;
    for (var i = 0; i < pages.length; i++) {
        dict[`${page_name} ${number2words.toWords(i+1)}`] = pages[i];
    }
}

// Takes a response with sections and explains the sections to the user, allowing them to select one
function sections(header_name, section_name_to_section, dict) {
    var section_names = Object.keys(section_name_to_section).reduce(function(acc, val) {
        return `${acc}, ${val}`;
    });
    section_names = section_names.charAt(0).toUpperCase() + section_names.slice(1);
    dict[header_name] = `This text has multiple sections. Say ${header_name} and then one of the following to hear more. ${section_names}`;

    Object.keys(section_name_to_section).map(function(key) {
        dict[`${header_name} ${key}`] = section_name_to_section[key];
    });
}

var routes = module.exports = {
    // Things we should respond to with a "tell"
    tell: {},
    // Things we should respond to with an "ask"
    ask: {},
    // Things we should respond to by running a function
    do: {}
};

// tell
routes.tell['quit'] = 'Goodbye!';

// ask
routes.ask['main_intent'] = strings.main_intent;
routes.ask['tutorial'] = strings.tutorial;
page('info', strings.info, routes.ask);
sections(
    'help',
    {
        'commands': strings.commands,
        'containment': strings.containment,
        'fighting': strings.fighting,
        'command parser': strings.command_parser,
        'actions': strings.actions,
        'directions': strings.directions,
        'objects': strings.objects,
        'adjectives': strings.adjectives,
        'prepositions': strings.prepositions,
        'sentences': strings.sentences,
        'ambiguity': strings.ambiguity,
        'bugs': strings.bugs
    },
    routes.ask);

// do
routes.do['save'] = function(app) {
    var conversation_save_file = files.getConversationSaveFile(app);
    var user_save_file = files.getUserSaveFile(app);
    console.log(user_save_file);
    console.log(conversation_save_file);

    spawn('cp', [conversation_save_file, user_save_file]);
    // TODO - error handling
    // TODO - confirm.
    app.ask("Saved game.");
};
routes.do['restore'] = function(app) {
    var conversation_save_file = files.getConversationSaveFile(app);
    var user_save_file = files.getUserSaveFile(app);

    console.log(user_save_file);
    console.log(conversation_save_file);
    spawn('cp', [user_save_file, conversation_save_file]);
    // TODO - error handling
    // TODO - confirm.
    app.ask("Restored game.");
};


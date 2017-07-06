'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var number2words = require('number-to-words');
var files = require('./files.js');
var strings = require('./strings.js');
var speaking = require('./speaking.js');
var zork = require('./zork.js');

const SECTIONS_KEY = 'sections';
const PAGES_KEY = 'pages';
const CURRENT_PAGE_KEY = 'current_page';

const QUIT_READING_KEY = 'quit_reading';
const NEXT_PAGE_KEY = 'next_page';
const LIST_OPTIONS_KEY = 'list_options';
const QUIT_SECTION_KEY = 'quit_section';

module.exports = {

    // Accepts an incoming main intent.
    acceptMain: function(app) {
        app.askSSML(strings.main_intent);
    },

    // Accepts an text input intent.
    acceptInput: function(app) {
        // Check context, do next context state
        var input = app.getRawInput();
        var dialogState = app.getDialogState();

        if (input in canned_responses.tell) {
            app.tell(canned_responses.tell[input]);
        } else if (input in canned_responses.ask) {
            autoPage(app, canned_responses.ask[input]);
        } else if (input in canned_responses.do) {
            canned_responses.do[input](app);
        } else if (input in canned_responses.sections) {
            askSectionsWithTitle(app, canned_responses.sections[input], input);
        } else {
            zork(app);
        }
    },

    // Accepts an incoming option selection intent.
    acceptOption: function(app) {
        var dialogState = app.getDialogState();
        // Note: pages must come first because pages can be nested in sections,
        // but sections cannot be nested in pages.
        if (PAGES_KEY in dialogState) {
            handlePagesOptionSelected(app);
        } else if (SECTIONS_KEY in dialogState) {
            handleSelectedSection(app);
        } else {
            app.askSSML('Sorry, something went wrong. Please try again.');
        }
    }
};

// Given a dict, build a list of the keys as options
function buildList(app, sections) {
    var list = app.buildList();
    Object.keys(sections).map(function(key) {
        list.addItems(
            // The option key and synonym are both the name of the section
            app.buildOptionItem(key, key).setTitle(key)
        );
    });
    return list;
}

// Takes a dictionary and asks the user to select one of the keys
// Passes the dictionary as the dialog state. Dialog state looks like:
// {'sections': sections_dict}
function askSectionsWithTitle(app, sections, title) {
    var prompt = `${title} has multiple sections. Say the section name or say "list"`;
    askSectionsWithPrompt(app, sections, prompt);
}

function askSectionsWithOptions(app, sections) {
    var prompt = 'The options are: ' + Object.keys(sections).reduce(function(acc, val, idx) {
        if (idx == Object.keys(sections).length - 1) {
            return `${acc}<break time='500ms' strength='weak'/>and ${val}`;
        } else {
            return `${acc}<break time='500ms'strength='weak'/>${val}`;
        }
    });
    askSectionsWithPrompt(app, sections, prompt);
}

function askSectionsWithPrompt(app, sections, prompt) {
    var dialogState = {};
    dialogState[SECTIONS_KEY] = sections;
    var list = buildList(app, sections);
    list.addItems(app.buildOptionItem(LIST_OPTIONS_KEY, ['list sections', 'list', 'sections', 'section', 'list section']).setTitle('List Options'));
    list.addItems(app.buildOptionItem(QUIT_SECTION_KEY, ['no', 'quit', 'leave', 'none', 'stop']).setTitle('Quit Section'));
    app.askWithListSSML(
        prompt,
        list,
        // Send the sections dict along with the request as the dialog state,
        // so we know what to say back when the user selects one of the options
        dialogState
    );
}

// Handles when a user selects one of the sections we asked them to select.
function handleSelectedSection(app) {
    var selectedSectionName = app.getSelectedOption();
    var dialogState = app.getDialogState();
    var sections = dialogState[SECTIONS_KEY];
    var input = app.getRawInput();

    if (app.getSelectedOption() == LIST_OPTIONS_KEY) {
        askSectionsWithOptions(app, sections);
    }
    if (app.getSelectedOption() == QUIT_SECTION_KEY) {
        app.askSSML('Ok, returning to game. What do you do next?');
    }
    if (selectedSectionName in sections) {
        var selectedSection = sections[selectedSectionName];

        if (typeof selectedSection === 'string' || selectedSection instanceof String) {
            autoPage(app, selectedSection);
        } else {
            askSectionsWithTitle(app, selectedSection, selectedSectionName);
        }
    } else {
        app.askSSML('That wasn\'t one of the sections. Returning to game.');
    }
}

// Takes a string that might be too long, turns it into multiple pages. Pages are delimited by \n.
// Calls app.askWithList with the first page and dialog state with the all of the pages.
// Dialog state looks like {'current_page': 0, 'pages': ['next page', 'next page', 'next page' ...]}
// Asks the user to select 'next' or 'quit reading';
// Use handlePagesOptionSelected() to handle a response from the user.
// TODO - smarter version, use on zork output
function autoPage(app, string) {
    var pages = string.split('\n');
    var dialogState = app.getDialogState();

    pages = pages.filter(function(page) {
        return /\S/.test(page);
    });

    if (pages.length === 1) {
        // if we came from a section selection dialog, resume that
        if (SECTIONS_KEY in dialogState) {
            askSectionsWithPrompt(app, dialogState[SECTIONS_KEY], `${pages[0]} Which section would you like to read next?`);
        } else {
            app.askSSML(pages[0]);
        }
    } else {
        for (var i = 0; i < pages.length; ++i) {
            var header = `Page ${number2words.toWords(i+1)} of ${number2words.toWords(pages.length)}. `;
            var footer = ` Would you like to keep reading?`;
            pages[i] =  header + pages[i];
            if (i != pages.length - 1) {
                pages[i] = pages[i] + footer;
            }
        }

        dialogState[PAGES_KEY] = pages;
        dialogState[CURRENT_PAGE_KEY] = 0;
        app.askWithListSSML(
            pages[0],
            app.buildList('Page Reader')
                .addItems([
                    app.buildOptionItem(NEXT_PAGE_KEY, ['yes', 'next', 'next page']).setTitle('Next Page'),
                    app.buildOptionItem(QUIT_READING_KEY, ['no', 'stop', 'quit', 'stop reading', 'quit reading', 'stop']).setTitle('Quit Reading')
                ]),
            dialogState
        );
    }
}

// Handles when a user is reading multiple pages and selects either 'next page' or 'quit reading'
function handlePagesOptionSelected(app) {
    var selectedOption = app.getSelectedOption();
    var dialogState = app.getDialogState();

    if (selectedOption == QUIT_READING_KEY) {
        if (SECTIONS_KEY in dialogState) {
            askSectionsWithPrompt(app, dialogState[SECTIONS_KEY], `Ok, would you like to read a different section?`);
        } else {
            app.askSSML('Ok, returning to game.');
        }
    } else {
        // Should be NEXT_PAGE_KEY
        var currentPage = dialogState[CURRENT_PAGE_KEY];
        var pages = dialogState[PAGES_KEY];

        var nextPage = currentPage + 1;

        // If the next page is the final page
        if (nextPage == pages.length - 1) {
            // if we came from a section selection dialog, resume that
            if (SECTIONS_KEY in dialogState) {
                askSectionsWithPrompt(app, dialogState[SECTIONS_KEY], `${pages[nextPage]} Which section would you like to read next?`);
            } else {
                // Ask the final page
                app.askSSML(pages[nextPage]);
            }
        } else {
            dialogState[PAGES_KEY] = pages;
            dialogState[CURRENT_PAGE_KEY] = nextPage;
            app.askWithListSSML(
                pages[nextPage],
                app.buildList('Page Reader')
                    .addItems([
                        app.buildOptionItem(NEXT_PAGE_KEY, ['yes', 'next', 'next page']).setTitle('Next Page'),
                        app.buildOptionItem(QUIT_READING_KEY, ['no', 'stop', 'quit', 'stop reading', 'quit reading']).setTitle('Quit Reading')
                    ]),
                dialogState
            );
        }
    }
}

var canned_responses = {
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
canned_responses.tell['quit'] = 'Goodbye!';

// ask
canned_responses.ask['tutorial'] = strings.tutorial;
canned_responses.ask['info'] = strings.info;

// sections. Each key in the object is a section. Nesting works.
var talking_to_dungeon = {
    'containment': strings.containment,
    'fighting': strings.fighting,
    'actions': strings.actions,
    'command parser': strings.command_parser
};
canned_responses.sections['dungeon help'] = {
    'dungeon commands': strings.commands,
    'talking to dungeon': talking_to_dungeon
};


// do
canned_responses.do['save'] = function(app) {
    var conversation_save_file = files.getConversationSaveFile(app);
    var user_save_file = files.getUserSaveFile(app);

    spawn('cp', [conversation_save_file, user_save_file]);
    // TODO - error handling
    // TODO - confirm.
    app.askSSML("Saved game. What do you do next?");
};
canned_responses.do['restore'] = function(app) {
    var conversation_save_file = files.getConversationSaveFile(app);
    var user_save_file = files.getUserSaveFile(app);

    spawn('cp', [user_save_file, conversation_save_file]);
    // TODO - error handling
    // TODO - confirm.
    app.askSSML("Restored game. What do you do next?");
};


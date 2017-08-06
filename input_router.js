'use strict';

var strings = require('./strings.js');
var reading = require('./reading.js');
var easy_answers = require('./easy_answers.js');
var zork = require('./zork.js');

module.exports = {

    // Accepts an incoming main intent.
    acceptMain: function(app) {
        app.askSSML(strings.main_intent);
    },

    // Accepts an text input intent.
    acceptInput: function(app) {
        var input = app.getRawInput();

        if (input in easy_answers.tell) {
            app.tell(easy_answers.tell[input]);
        } else if (input in easy_answers.ask) {
            reading.autoPage(app, easy_answers.ask[input]);
        } else if (input in easy_answers.do) {
            easy_answers.do[input](app);
        } else if (input in easy_answers.sections) {
            reading.askSectionsWithTitle(app, easy_answers.sections[input], input);
        } else {
            zork(app);
        }
    },

    // Accepts an incoming option selection intent.
    acceptOption: function(app) {
        if (!reading.handleOptionSelected(app)) {
            app.askSSML('Sorry, something went wrong. Please try again.');
        }
    }
};


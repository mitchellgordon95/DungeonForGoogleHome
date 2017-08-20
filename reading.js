'use strict';

var number2words = require('number-to-words');

const NEXT_PAGE_KEY = 'next_page';

var reading = module.exports = {
    QUIT_READING_KEY: 'quit_reading',

    // Takes a string that might be too long, turns it into multiple pages. Pages are delimited by \n.
    // TODO - smarter version, use on zork output
    makePages: function (string) {
        var pages = string.split('\n');

        pages = pages.filter(function(page) {
            return /\S/.test(page);
        });

        if (pages.length === 1) {
            return [string];
        } else {
            for (var i = 0; i < pages.length; ++i) {
                var header = `Page ${number2words.toWords(i+1)} of ${number2words.toWords(pages.length)}. `;
                var footer = ` Would you like to keep reading?`;
                pages[i] =  header + pages[i];
                if (i != pages.length - 1) {
                    pages[i] = pages[i] + footer;
                }
            }

            return pages;
        }
    },

    makePagesOptions: function(app) {
        return app.buildList('Page Reader')
            .addItems([
                app.buildOptionItem(NEXT_PAGE_KEY, ['yes', 'next', 'next page']).setTitle('Next Page'),
                app.buildOptionItem(reading.QUIT_READING_KEY, ['no', 'stop', 'quit', 'stop reading', 'quit reading', 'stop']).setTitle('Quit Reading')
            ]);
    }
};

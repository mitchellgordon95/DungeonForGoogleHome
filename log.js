'use strict';
var files = require('./files.js');
const fs = require('fs');

var logging = module.exports = {
    logInput: function(app) {
        var log = {
            time: Date.now().valueOf(),
            input: app.getRawInput()
        };
        fs.appendFile(files.getUserInputLogFile(app), JSON.stringify(log) + "\n");
    }
};

'use strict';

const hostname = 'dungeon.mitchgordon.me';
const port = '443';
const input_router = require('./input_router.js');
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const https = require('https');
const fs = require('fs');
var spawn = require('child_process').spawn;
var path = require('path');

const express = require('express');
var expressApp = express();

const bodyParser = require('body-parser');
expressApp.use(bodyParser.json());

function mainIntent(app) {
    app.ask(input_router.ask["main_intent"]);
}

function rawInput(app) {
    // TODO - validate conversation / user ids for injection
    var input = app.getRawInput();
    if (input in input_router.tell) {
        app.tell(input_router.tell[input]);
    } else if (input in input_router.ask) {
        app.ask(input_router.ask[input]);
    } else if (input in input_router.do) {
        input_router.do[input](app);
    } else {
        var save_file = app.getUser().user_id + app.getConversationId();
        var zork = spawn('./zork', [save_file, input], {cwd: path.normalize('./zork')});

        zork.stdout.on('data', (data) => {
            app.ask(data.toString());
        });

        zork.stderr.on('data', (data) => {
            app.tell('Sorry, something went wrong. Try again later.');
            console.log(`ps stderr: ${data}`);
        });
    }
    // TODO - delete tmp files on conversation end
}

expressApp.post('/', function(req, res) {
    const app = new ActionsSdkApp({request: req, response: res});
    const actionMap = new Map();
    actionMap.set(app.StandardIntents.MAIN, mainIntent);
    actionMap.set(app.StandardIntents.TEXT, rawInput);

    app.handleRequest(actionMap);
});

var options = {
    ca: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.ca-bundle'),
    key: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.key'),
    cert: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.crt')
};
https.createServer(options, expressApp).listen(443);

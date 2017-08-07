'use strict';

const hostname = 'dungeon.mitchgordon.me';
const port = '443';
const input_router = require('./input_router.js');
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const https = require('https');
const fs = require('fs');
var files = require('./files.js');

const express = require('express');
var expressApp = express();

const bodyParser = require('body-parser');
expressApp.use(bodyParser.json());

if (!fs.existsSync(files.SAVE_DIRECTORY)) {
    fs.mkdir(files.SAVE_DIRECTORY);
}

expressApp.post('/', function(req, res) {
    const app = new ActionsSdkApp({request: req, response: res});
    app.askSSML = function (text, dialogState) { app.ask(`<speak> ${text} </speak>`, dialogState); };
    app.askWithListSSML = function (prompt, list, dialogState) {
        app.askWithList(`<speak> ${prompt} </speak>`, list, dialogState);
    };
    const actionMap = new Map();
    actionMap.set(app.StandardIntents.MAIN, input_router.acceptMain);
    actionMap.set(app.StandardIntents.TEXT, input_router.acceptInput);
    actionMap.set(app.StandardIntents.OPTION, input_router.acceptOption);

    app.handleRequest(actionMap);
});

var options = {
    ca: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.ca-bundle'),
    key: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.key'),
    cert: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.crt')
};
https.createServer(options, expressApp).listen(443);

'use strict';

const hostname = 'dungeon.mitchgordon.me';
const port = '443';
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
    app.ask("Hello?");
}

function rawInput(app) {
    var input = app.getRawInput();
    if (input === 'bye') {
        app.tell('Goodbye!');
    } else {
        var zork = spawn("./zork", [], {cwd: path.normalize('./zork')});

        zork.stdout.on('data', (data) => {
            // data = data.replace('/\W/g', '');
            app.ask(data.toString());
            console.log(`ps stdout: ${data}`);
        });

        zork.stderr.on('data', (data) => {
            app.tell('Sorry, something went wrong. Try again later.');
            console.log(`ps stderr: ${data}`);
        });

        zork.on('close', (code) => {
            console.log(`ps process exited with code ${code}`);
        });
    }
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

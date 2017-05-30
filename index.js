'use strict';

const hostname = 'dungeon.mitchgordon.me';
const port = '443';
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const https = require('https');
const fs = require('fs');

const express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/', function(req, res) {
    const actionsApp = new ActionsSdkApp({request: req, response: res});
    actionsApp.tell("Hi");
});

var options = {
    ca: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.ca-bundle'),
    key: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.key'),
    cert: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.crt')
};
https.createServer(options, app).listen(443);

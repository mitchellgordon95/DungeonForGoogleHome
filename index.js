'use strict';

const hostname = 'dungeon.mitchgordon.me';
const port = '443';
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const https = require('https');
const fs = require('fs');

var options = {
    ca: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.ca-bundle'),
    key: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.key'),
    cert: fs.readFileSync('/home/ubuntu/https_certs/dungeon_mitchgordon_me.crt')
};

https.createServer(options, (req, res) => {
    // const app = new ActionsSdkApp({request: req, response: res});

    // Create functions to handle requests here
    console.log("Got a request");
    // app.tell("Hi");
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello World!');
    res.end();
}).listen(443);

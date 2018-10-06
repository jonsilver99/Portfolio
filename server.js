'use strict';

const express = require('express');
const server = express();
const path = require('path');
const bodyParser = require('body-parser')
const mailController = require('./controllers/mailController')

let PORT = process.env.PORT || 4200;

// Set template engine
// server.set('view engine', 'ejs');

// Middleware
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use((req, res, next) => {
    console.log(`requested url: ${req.url}`);
    next();
})

// Static assets
// server.use(express.static(__dirname + '/public'));
server.use('/src', express.static(__dirname + '/src'));
server.use('/build', express.static(__dirname + '/build'));
server.use('/assets', express.static(__dirname + '/build/assets'));

// Site load
server.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

// Contact/email message handling
server.use('/contactMessage', mailController)

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
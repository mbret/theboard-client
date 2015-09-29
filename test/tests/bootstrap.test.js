'use strict';

process.env.NODE_ENV = 'testing';

var Sails = require('sails');
var path = require('path');
var rc = require('rc');
var sails;

process.env.LIB_PATH   = path.join(__dirname, '../lib');
process.env.CONFIG_PATH   = path.join(__dirname, '..');

before(function(done) {

    Sails.lift(rc('sails'), function(err, server){
        console.log(err);

        if (err) return done(err);
        sails = server;

        done(null, sails);
    });
});

after(function(done) {
    // here you can clear fixtures, etc.
    sails.lower(done);
});
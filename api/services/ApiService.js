'use strict';

var request = require('request');

exports.signin = function(email, password, cb){

    // Mock Tests
    if(sails.config.environment === 'testing'){
        return ApiMock.signin(email, password, cb);
    }

    request
        .post('http://localhost:1337/auth/signin', {
            form: {
                "email": email,
                "password": password
            }
        }, function(err, response, body){
            if(err){
                return cb(err);
            }
            return cb(null, response, body);
        });
};

var ApiMock = {
    signin: function(email, password, cb){
        return cb(null, {statusCode: 200}, {
            token: 'XXXXXXXXXX',
            user: {
                "email": email,
                "password": password
            }
        });
    }
};
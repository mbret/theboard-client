'use strict';

var request = require('request');

/**
 *
 * @param email
 * @param password
 * @param cb
 * @returns {*}
 */
exports.login = function(email, password, cb){

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
            return cb(null, response, JSON.parse(body));
        });
};

exports.register = function(email, password, cb){
    request
        .post('http://localhost:1337/auth/signup', {
            form: {
                "email": email,
                "password": password
            }
        }, function(err, response, body){
            if(err){
                return cb(err);
            }
            return cb(null, response, JSON.parse(body));
        });
};

var ApiMock = {
    signin: function(email, password, cb){
        return cb(null, {statusCode: 200}, {
            token: 'XXXXXXXXXX',
            user: {
                "id": 1,
                "email": email,
                "password": password
            }
        });
    }
};
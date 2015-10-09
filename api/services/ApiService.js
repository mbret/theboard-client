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

    request
        .post('http://localhost:1337/auth/signin', {
            form: {
                "email": email,
                "password": password
            }
        }, function(err, response, body){
            console.log(err);
            if(err){
                return cb(err);
            }

            if(response.statusCode === 200){
                response.body = JSON.parse(body);
            }

            return cb(null, response);
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
            if(response.statusCode === 200 && body){
                body = JSON.parse(body);
            }
            return cb(null, response, body);
        });
};

exports.user = function(id, cb){
    request
        .get({url: 'http://localhost:1337/users/:id'.replace(':id', id)}, function(err, response, body){
            if(err){
                return cb(err);
            }
            if(response.statusCode === 200 && body){
                body = JSON.parse(body);
            }
            return cb(null, response, body);
        });
};
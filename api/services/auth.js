/**
 * Created by Maxime on 1/15/2015.
 */

var jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports = {

    generateToken: function(user){
        var issueDate = moment().utc().format();
        var token = jwt.sign({user:user.id}, sails.config.token.secret, { expiresInMinutes: sails.config.token.expiresInMinutes });
        return token;
    },
    
    getTokenPayload: function(token){
        return jwt.decode(token);
    }
};
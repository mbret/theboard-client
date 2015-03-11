var request = require('supertest');

module.exports = {
    
    login: function(agent, cb){
        agent
            .post('/auth/signin')
            .send({ email: sails.config.user.email, password: sails.config.user.password})
            .end(cb);
    }

};
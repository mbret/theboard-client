var request = require('supertest');

module.exports = function(agent){
    
    this.login = function(cb){
        agent
            .post('/auth/signin')
            .send({ email: sails.config.test.user.email, password: sails.config.test.user.password})
            .end(cb);
    }
    
    return this;
}
var request = require('supertest');
var utils   = require('../../utils.js');
var app;
var agent;

describe('AppController', function() {

    before(function(next) {
        app = sails.hooks.http.app;
        // this agent is logged
        agent = request.agent(sails.hooks.http.app);
        utils(agent).login(next);
    });

    after(function(done) {
        done();
    });

    /**
     * Index function.
     * Return the app index page.
     * /
     */
    describe('index()', function() {
        it('should return index (logged)', function (done){
            agent
                .get('/')
                .send()
                .expect(200, done);
        });
        it('should redirect to /login (not logged)', function (done){
            request(app)
                .get('/')
                .send()
                .expect(302)
                .expect('location', '/login', done);
        });
    });
    
});
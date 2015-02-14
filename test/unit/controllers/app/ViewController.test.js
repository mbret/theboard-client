var request = require('supertest');
var utils   = require('../../../utils.js');
var app;
var agent;

describe('ViewController', function() {

    var profiles;
    
    before(function(next) {
        app = sails.hooks.http.app;
        // this agent is logged
        agent = request.agent(sails.hooks.http.app);
        utils(agent).login(next);
    });

    after(function(done) {
        done();
    });
    
    beforeEach(function(next){
        // get list of profiles
        Profile.find()
            .then(function(results){
                profiles = results;
                return next();
            })
            .catch(next);
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
                .expect('location', '/signin', done);
        });
    });

    /**
     * Login function
     * /login
     */
    describe('signin', function() {
        it('should return 302 (logged)', function (done){
            agent
                .get('/signin')
                .send()
                .expect(302)
                .expect('location', '/', done);
        });
        it('should return 200 (not logged)', function (done){
            request(app)
                .get('/signin')
                .send()
                .expect(200, done);
        });
    });
    
});
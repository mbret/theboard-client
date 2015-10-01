var request = require('supertest');
//var conf = require(process.env.CONFIG_PATH + '/config');
var utils   = require(process.env.LIB_PATH + '/logger.js');
var app;
var agent;

describe('ViewController', function() {

    before(function(next) {
        app = sails.hooks.http.app;
        // this agent is logged
        agent = request.agent(sails.hooks.http.app);
        utils.login(agent, next);
    });

    after(function(done) {
        done();
    });
    
    beforeEach(function(next){
        next();
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
                .expect(200, done);
        });
        it('should redirect to /login (not logged)', function (done){
            request(app)
                .get('/')
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
                .expect(302)
                .expect('location', '/', done);
        });
        it('should return 200 (not logged)', function (done){
            request(app)
                .get('/signin')
                .expect(200, done);
        });
    });
    
});
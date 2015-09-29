var request = require('supertest');
//var conf    = require(process.env.CONFIG_PATH + '/config');
//var utils   = require(process.env.LIB_PATH + '/logger.js');
var should = require('should');
var agent;
var app;

// https://github.com/visionmedia/superagent/blob/master/test/node/agency.js
describe('integration.controllers.auth', function() {

    before(function(done) {
        app = sails.hooks.http.app;
        done();
    });

    /**
     * Login function
     * /login
     */
    describe('signin', function(){

        var agent;

        before(function(done) {
            app = sails.hooks.http.app;
            agent = request.agent(sails.hooks.http.app);
            done();
        });

        it('should return the view & 200', function(done){
            agent.get('/signin')
                .expect(200, done);
        });

        it('should log', function(done){
            agent.post('/signin')
                .send({})
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err);
                    should.exist(res.headers['set-cookie']);
                    done();
                });
        });

        it('should get redirected because already logged', function(done){
            agent.get('/signin')
                .expect(302, done);
        });
    });
    
    describe('signup', function(){
        //it('should return 400 because of bad email', function(done){
        //    agent
        //        .post('/auth/signup')
        //        .send({ email: 'user@dfg', password: sails.config.user.password})
        //        .expect(400, done);
        //});
        //it('should return 400 because of bad password', function(done){
        //    agent
        //        .post('/auth/signup')
        //        .send({ email: 'user@dfg.com', password: 's'})
        //        .expect(400, done);
        //});
        //it('should return 400 because this email is taken', function (done){
        //    agent
        //        .post('/auth/signup')
        //        .send({ email: sails.config.user.email, password: sails.config.user.password})
        //        .expect(400, done);
        //});
        //it('should register', function (done){
        //    agent
        //        .post('/auth/signup')
        //        .send({ email: 'test@test.com', password: 'password'})
        //        .expect(200)
        //        .end(function(err, res){
        //            if (err) return done(err);
        //            if( ! res.body.user ){
        //                return done(new Error('No user in response'));
        //            }
        //            if( ! res.body.token ){
        //                return done(new Error('No token in response'));
        //            }
        //            return done();
        //        });
        //});
    });

    /**
     * Logout function
     * /logout
     */
    describe('signout', function() {

        var agent;

        before(function(done) {
            app = sails.hooks.http.app;
            agent = request.agent(sails.hooks.http.app);
            agent.post('/signin')
                .send({})
                .end(done);
        });

        it('should be redirected as we are not logged', function(done){
            request(app).get('/logout')
                .expect(302)
                .expect('location', '/signin', done);
        });

    });


});
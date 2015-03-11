var request = require('supertest');
var conf = require('../../config');
var utils   = require(conf.path.tools + '/logger.js');
var agent;
var app;

describe('AuthController', function() {



    before(function(done) {
        app = sails.hooks.http.app;

        // We use more low lvl superagent to keep cookies http://stackoverflow.com/questions/14001183/how-to-authenticate-supertest-requests-with-passport
        // So we keep reference of the same agent
        // This agent is logged at this point
        agent = request.agent(app);
        utils.login(agent, done);
        
    });

    after(function(done) {
        done();
    });

    /**
     * Login function
     * /login
     */
    describe('signin', function() {
        it('should return 400 because of bad credentials', function(done){
            agent
                .post('/auth/signin')
                .send({ email: 'user@user.fr', password: sails.config.user.password})
                .expect(400, done);
        });
        it('should log', function (done){
            agent
                .post('/auth/signin')
                .send({ email: sails.config.user.email, password: sails.config.user.password})
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    if( ! res.body.user ){
                        return done(new Error('No user in response'));
                    }
                    if( ! res.body.token ){
                        return done(new Error('No token in response'));
                    }
                    return done();
                });
        });
    });
    
    describe('signup', function(){
        it('should return 400 because of bad email', function(done){
            agent
                .post('/auth/signup')
                .send({ email: 'user@dfg', password: sails.config.user.password})
                .expect(400, done);
        });
        it('should return 400 because of bad password', function(done){
            agent
                .post('/auth/signup')
                .send({ email: 'user@dfg.com', password: 's'})
                .expect(400, done);
        });
        it('should return 400 because this email is taken', function (done){
            agent
                .post('/auth/signup')
                .send({ email: sails.config.user.email, password: sails.config.user.password})
                .expect(400, done);
        });
        it('should register', function (done){
            agent
                .post('/auth/signup')
                .send({ email: 'test@test.com', password: 'password'})
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    if( ! res.body.user ){
                        return done(new Error('No user in response'));
                    }
                    if( ! res.body.token ){
                        return done(new Error('No token in response'));
                    }
                    return done();
                });
        });
    })

    /**
     * Logout function
     * /logout
     */
    describe('logout()', function() {

        // Test if logout redirect well after logout
        it('should logout and redirect to /signin (logged) ', function (done){
            agent
                .get('/auth/logout')
                .expect(302)
                .expect('location','/signin', done);
        });

        // Test if we were correctly logged and if redirection is okay
        it('should redirect to /signin (not logged) ', function (done){
            agent
                .get('/auth/logout')
                .expect(302)
                .expect('location','/signin', done);
        });
    });


});
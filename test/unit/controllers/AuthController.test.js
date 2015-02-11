var request = require('supertest');
var agent;

describe('AuthController', function() {

    before(function(done) {
        // We use more low lvl superagent to keep cookies http://stackoverflow.com/questions/14001183/how-to-authenticate-supertest-requests-with-passport
        // So we keep reference of the same agent
        agent = request.agent(sails.hooks.http.app);
        done();
    });

    after(function(done) {
        done();
    });

    /**
     * Login function
     * /login
     */
    describe('login()', function() {
        it('should return 200', function (done){
            agent
                .get('/login')
                .send()
                .expect(200, done);
        });
        it('should return 400 because of bad credentials', function(done){
            agent
                .post('/login')
                .send({ email: 'user@user.fr', password: sails.config.test.user.password})
                .expect(400, done);
        });
        it('should log and redirect to /', function (done){
            agent
                .post('/login')
                .send({ email: sails.config.test.user.email, password: sails.config.test.user.password})
                .expect(302)
                .expect('location','/', done);
        });
        it('should return 403 because we are logged in', function (done){
            agent
                .get('/login')
                .expect(302)
                .expect('location','/', done);
        });
    });

    /**
     * Logout function
     * /logout 
     */
    describe('logout()', function() {
        
        // Test if logout redirect well after logout
        it('(logged) should logout and redirect to /', function (done){
            agent
                .post('/auth/logout')
                .expect(302)
                .expect('location','/', done);
        });
        
        // Test if we were correctly logged and if redirection is okay
        it('(not logged) should redirect to login', function (done){
            agent
                .get('/logout')
                .expect(302)
                .expect('location','/login', done);
        });
    });


});
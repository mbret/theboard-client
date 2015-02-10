var request = require('supertest');

describe('AuthController', function() {

    describe('#login()', function() {
        it('should return 200', function (done){
            request(sails.hooks.http.app)
                .get('/login')
                .send()
                .expect(200, done);
        });
        it('should return 400 because of bad credentials', function(done){
            request(sails.hooks.http.app)
                .post('/login')
                .send({ email: 'user@gmail.fr', password: 'password'})
                .expect(400, done);
        });
        it('should redirect to /', function (done){
            request(sails.hooks.http.app)
                .post('/login')
                .send({ email: 'user@gmail.com', password: 'password'})
                .expect(302)
                .expect('location','/', done);
        });
        it('should return 403 because we are logged in', function (done){
            request(sails.hooks.http.app)
                .post('/login')
                .expect(403, done);
        });
    });

    describe('#logout()', function() {
        it('should redirect to /', function (done){
            request(sails.hooks.http.app)
                .post('/auth/logout')
                .expect(302)
                .expect('location','/', done);
        });
    });

});
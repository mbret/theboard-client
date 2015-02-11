var request = require('supertest');
var utils   = require('../../utils.js');
var app;
var agent;

describe('AppController', function() {

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
                .expect('location', '/login', done);
        });
    });

    /**
     * Unit test for getProfile function.
     * Function that return a specified profile passed in param.
     */
    describe('getProfile()', function() {
        var route = "/users/profiles";
        it('should redirect to /login (not logged)', function (done){
            request(app)
                .get(route + "/1")
                .send()
                .expect(403, done);
        });
        it('should return 404 bad id (logged)', function (done){
            agent
                .get(route + "/1")
                .send()
                .expect(404, done);
        });
        it('should return correct profile (logged)', function (done){
            agent
                .get(route + "/" + profiles[0].id)
                .send()
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    if(res.body.id !== profiles[0].id){
                        return done(new Error('Not same profile ' +  res.body.id + ' !== ' + profiles[0].id ));
                    }
                    return done();
                });
        });
    });
    
});
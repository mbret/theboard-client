var request = require('supertest');
var utils   = require('../../../utils.js');
var app;
var agent;

describe('ProfileController', function() {

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
     * Widget find one
     */
    describe('find', function() {
        var route = "/api/users/widgets";
        it('should redirect to /login (not logged)', function (done){
            request(app)
                .get(route + "/1")
                .send()
                .expect(403, done);
        });
        it('should return 404 not found (logged)', function (done){
            agent
                .get(route + "/1")
                .send()
                .expect(404, done);
        });
        it('should return correct widget (logged)', function (done){
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
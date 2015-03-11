var request = require('supertest');
var conf = require('../../config');
var utils = require(conf.path.tools + '/logger.js');
var app;
var agent;
var profiles;

describe('ProfileController', function() {

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
        // get list of profiles
        Profile.find()
            .then(function(results){
                profiles = results;
                return next();
            })
            .catch(next);
    });


    /**
     * Unit test for getProfile function.
     * Function that return a specified profile passed in param.
     */
    describe('findOne', function() {
        var route = "/api/users/profiles";
        it('should redirect to /login (not logged)', function (done){
            request(app)
                .get(route + "/" + profiles[0].id)
                .expect(403, done);
        });
        it('should return 404 bad id (logged)', function (done){
            async.series([
                function(cb){
                    agent.get(route + "/9999").expect(404, cb);
                },
                function(cb){
                    agent.get(route + "/a").expect(400, cb);
                }
            ], done);
        });
        it('should return correct profile (logged)', function (done){
            agent
                .get(route + "/" + profiles[0].id)
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
var Sails = require('sails');
var sails;

before(function(done) {
    Sails.lift({
        log:{
            level: "error"
        },
        models: {
            migrate: 'drop' // erase database before each launch
        },
        environment: 'development',
        autoLogin: false,
        // config only relative to test
        test: {
            // user credentials
            user: {
                email: 'user@gmail.com',
                password: 'password'
            }
        }
    }, function(err, server){
        console.log(err);

        if (err) return done(err);
        sails = server;

        done(null, sails);
    });
});

after(function(done) {
    // here you can clear fixtures, etc.
    sails.lower(done);
});
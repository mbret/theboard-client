var Sails = require('sails');
var sails;

before(function(done) {
    Sails.lift({
        
        log:{
            level: "error"
        },
        
        connections: {
            test: {
                adapter: 'sails-mysql',
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'theboard_test'
            }
        },
        
        models: {
            connection: 'test',
            migrate: 'drop' // erase database before each launch
        },
        
        environment: 'development',
        
        passport: {
            autoLogin: false
        },

        fillDb: true,
        
        // user credentials
        user: {
            email: 'user@gmail.com',
            password: 'password'
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
/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var Promise = require('bluebird');
var fs = require('fs');

module.exports.bootstrap = function(cb) {

    // Load passport providers on startup
    // Will add to passport.use() all the strategy
    sails.services.passport.loadStrategies();


    Promise.all([


        Widget.create({
          identity: 'Velib',
          identityHTML: 'widget-velib',
          url: 'widgets/velib/widget.html',
          baseURL: 'widgets/velib/widget.html',
          permissions: [
              'location'
          ],
          //options: {
          //    defaultLocation: 'New York'
          //},
          sizeX: 1,
          sizeY: 1,
          row: 0,
          col: 0
        }),
        //Widget.create({
        //    identity: 'Widget meteo',
        //    identityHTML: 'widget-meteo',
        //    url: 'widgets/meteo/widget.html',
        //    baseURL: 'widgets/meteo/widget.html',
        //    permissions: [
        //      'mail',
        //      'location'
        //    ],
        //    //options: {
        //    //    defaultLocation: 'New York'
        //    //},
        //    sizeX: 1,
        //    sizeY: 1,
        //    row: 1,
        //    col: 2
        //}),
        //Widget.create({
        //    identity: 'Widget clock',
        //    identityHTML: 'widget-clock',
        //    url: 'widgets/clock/widget.html',
        //    baseURL: 'widgets/clock/widget.html',
        //    backgroundColor: '#202020',
        //    sizeX: 2,
        //    sizeY: 1,
        //    row: 0,
        //    col: 2
        //}),
        Widget.create({
          identity: 'Widget sample',
          identityHTML: 'widget-sample',
          url: 'widgets/sample/widget.html',
          baseURL: 'widgets/sample/widget.html',
          backgroundColor: '#57aae1',
          permissions:[
              'email',
              //'location'
          ],
          options:[
              {
                  id: 'option1', // must not have space
                  name: 'Option 1',
                  placeholder: 'Enter something',
                  type: 'text',
                  default: 'toto'
              },
              {
                  id: 'option2', // must not have space
                  name: 'Option 2',
                  placeholder: 'Select city',
                  type: 'select',
                  options: ['Nancy', 'Toul'],
                  required: false
                  //default: 'Nancy'
              }
          ],
          sizeX: 1,
          sizeY: 1,
          row: 0,
          col: 2
        }),
        //Widget.create({
        //  identity: 'Widget meteo 4',
        //  identityHTML: 'widget-meteo4',
        //  url: 'widgets/meteo/widget.html',
        //  baseURL: 'widgets/meteo/widget.html',
        //  //options: {
        //  //    defaultLocation: 'New York'
        //  //},
        //  sizeX: 1,
        //  sizeY: 1,
        //  row: 0,
        //  col: 5
        //}),
        //Widget.create({
        //    identity: 'Widget Daily Word',
        //    identityHTML: 'widget-daily-word',
        //    url: 'widgets/dailyWord/widget.html',
        //    baseURL: 'widgets/dailyWord/widget.html',
        //    backgroundColor: '#57aae1',
        //    sizeX: 1,
        //    sizeY: 1,
        //    row: 0,
        //    col: 3
        //})

  ]).then(function(widgets){
        
      // Create user for test
      if( sails.config.environment == 'development' ){
          return User.create({
              email    : 'user@gmail.com'
          }).then(function(user){
              
              user.settings.add(UserSetting.buildNewSetting('widgetsBorders', false));
              
              user.profiles.add( { name: 'Desktop', description: 'For my Desktop, it use a 1920x1080 resolution and is full of widget ;)'});
              user.profiles.add( { name: 'TV', default: false} );

              return user.save().then(function(user){
                  return user;
              });
          })
            // Fill profiles
            .then(function(user){
                return Profile.find({user: user.id}).then(function(profiles){

                    var promises = [];
                    // Insert widget for this user
                    _.forEach(profiles, function(profile, key){
                        // Insert widget for this user
                        _.forEach(widgets, function(widget, key){
                            if( !(profile.name === "TV" && widget.identity === "Velib") ){
                                profile.registerWidget(widget);
                            }
                        });
                        promises.push(profile.save());
                    });
                    return Promise.all(promises).then(function(){
                        return user;
                    })
                });
            })
              .then(function(user){
              return Passport.create({
                  protocol : 'local',
                  password : 'password',
                  user     : user.id
              });
        });
      }
      else{
          return;
      }

  }).then(function(){

        // Create data dir if it doesnt exist (with app rights)
        return FileService.createDataDir(cb);

  }).catch(function(err){
        //require('util').inspect(err);
        return cb(err);
  });
};

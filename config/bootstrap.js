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

module.exports.bootstrap = function(cb) {

    // Load passport providers on startup
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
          options: {
              defaultLocation: 'New York'
          },
          sizeX: 1,
          sizeY: 1,
          row: 0,
          col: 1
      }),
      Widget.create({
            identity: 'Widget meteo',
            identityHTML: 'widget-meteo',
            url: 'widgets/meteo/widget.html',
            baseURL: 'widgets/meteo/widget.html',
            permissions: [
              'mail',
              'location'
            ],
            options: {
                defaultLocation: 'New York'
            },
            sizeX: 1,
            sizeY: 1,
            row: 0,
            col: 0
      }),
      Widget.create({
          identity: 'Widget clock',
          identityHTML: 'widget-clock',
          url: 'widgets/clock/widget.html',
          baseURL: 'widgets/clock/widget.html',
          backgroundColor: '#202020',
          sizeX: 2,
          sizeY: 1,
          row: 0,
          col: 2
      }),
      Widget.create({
          identity: 'Widget sample',
          identityHTML: 'widget-sample',
          url: 'widgets/sample/widget.html',
          baseURL: 'widgets/sample/widget.html',
          backgroundColor: '#57aae1',
          permissions:[
              'user_mail',
              'location'
          ],
          sizeX: 1,
          sizeY: 1,
          row: 1,
          col: 2
      }),
      Widget.create({
          identity: 'Widget meteo 4',
          identityHTML: 'widget-meteo4',
          url: 'widgets/meteo/widget.html',
          baseURL: 'widgets/meteo/widget.html',
          options: {
              defaultLocation: 'New York'
          },
          sizeX: 1,
          sizeY: 1,
          row: 0,
          col: 5
      }),



  ]).then(function(){
      return cb();
  }).catch(function(err){
      return cb(err);
  });
};

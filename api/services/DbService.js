var Promise = require('bluebird');

var widgetSample = {
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
};

var widgetMeteo = {
    identity: 'Widget meteo',
    identityHTML: 'widget-meteo',
    url: 'widgets/meteo/widget.html',
    baseURL: 'widgets/meteo/widget.html',
    permissions: [
      'mail',
      //'location'
    ],
    //options: {
    //    defaultLocation: 'New York'
    //},
    sizeX: 1, sizeY: 1, row: 2, col: 0
};

module.exports = {

    /**
     *
     * @return promise
     */
    init: function(env){
        return this['init_' + env]();
    },

    init_test: function(){
        return Promise.all([
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
            Widget.create(widgetMeteo),
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
            Widget.create(widgetSample),
            //Widget.create(widgetSample),
            //Widget.create(widgetSample),
            //Widget.create(widgetSample),
            //Widget.create(widgetSample),
            //Widget.create(widgetSample),
            //Widget.create(widgetSample),
            //Widget.create(widgetSample),
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
        ]).then(function(widgets) {

            // Get default values like avatar / banner etc
            var values = {
                email: 'user@gmail.com'
            };

            // Create user for test
            return User.create(values).then(function (user) {

                // UsersService.prepareInstance(user);

                user.settings.add(UserSetting.buildNewSetting('widgetsBorders', false));
                user.profiles.add({
                    name: 'Desktop',
                    description: 'For my Desktop, it use a 1920x1080 resolution and is full of widget ;)',
                    default: true
                });
                user.profiles.add({name: 'TV', default: false});

                return user.save().then(function (user) {
                    return user;
                });
            })
            // Fill profiles
            .then(function (user) {
                return Profile.find({user: user.id}).then(function (profiles) {

                    var promises = [];
                    // Insert widget for this user
                    _.forEach(profiles, function (profile, key) {
                        // Insert widget for this user
                        _.forEach(widgets, function (widget, key) {
                            if (!(profile.name === "TV" && widget.identity === "Velib")) {
                                profile.registerWidget(widget);
                            }
                        });
                        promises.push(profile.save());
                    });
                    return Promise.all(promises).then(function () {
                        return user;
                    })
                });
            })
            .then(function (user) {
                return Passport.create({
                    protocol: 'local',
                    password: 'password',
                    user: user.id
                });
            });
        });
    },

    init_development: function(){
        return this.init_test();
    },

    /**
     * For the production there is a small change.
     * It's not possible to drop or alter so we need to check if db already contain data.
     * If yes then do not init.
     * To reset database delete .tmp
     */
    init_production: function(){
        sails.log.debug('Dbservice: production database initializing...');
        return Widget.findOne({identity: 'Velib'}).then(function(widget){

            if(widget){
                sails.log.debug('DbService: The database seems to be already initialized, operation ommitted!');
                return;
            }

            return Promise.all([
              Widget.create({
                  identity: 'Velib',
                  identityHTML: 'widget-velib',
                  url: 'widgets/velib/widget.html',
                  baseURL: 'widgets/velib/widget.html',
                  permissions: [
                      'location'
                  ],
                  sizeX: 1, sizeY: 1, row: 0, col: 0
              }),
              Widget.create({
                  identity: 'Widget sample',
                  identityHTML: 'widget-sample',
                  url: 'widgets/sample/widget.html',
                  baseURL: 'widgets/sample/widget.html',
                  backgroundColor: '#57aae1',
                  permissions:[
                      'email',
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
                  sizeX: 1, sizeY: 1, row: 0, col: 2
              }),
            ]).then(function(widgets) {
                return null;
            });
        })

    }

}

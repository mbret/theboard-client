(function(){

    'use strict';

    var instance;
    function Widget( conf ){

        var self = this;
        var process;
        this.identity = conf.identity;
        // Merge global config with widget scope config
        this.configuration = _.assign({
            process: {
                interval: 500000
            },
            woeid: '',
            unit: 'c'
        }, conf);

        process = new Process( _fetchData, self.configuration.process.interval );

        this.start = function(){
            process.start();
        };

        this.stop = function(){
            self.GUI.renderStopped();
            process.stop();
        };

        this.refresh = function(){
            process.reset();
        };

        // This is the 'display refresh method'
        // This method get the needed data (from API for example)
        // Then refresh the display
        function _fetchData(){
            self.GUI.renderRefreshing();

            var location = null;

            if(self.configuration.permissions.location !== null){
                location = self.configuration.permissions.location.latitude + ',' + self.configuration.permissions.location.longitude;
            }
            
            // If user specified option then take it instead of geoloc
            if(self.configuration.options.location && self.configuration.options.location !== null){
                location = self.configuration.options.location;
            }

            if(location === null || location === ''){
                self.GUI.renderError(self.GUI.RENDER_ERROR_NO_LOCATION);
                return;
            }

            $.simpleWeather({
                location: location,
                woeid: self.configuration.woeid,
                unit: self.configuration.unit,
                success: function(weather) {

                    var dateSunset = createDateFromSunset( weather.sunset );
                    var dateSunrise = createDateFromSunset( weather.sunrise );
                    var isDay = moment().isBefore( dateSunset ) && moment().isAfter( dateSunrise );
                    var icon = getWeatherIcon( weather.currently, isDay );

                    var weather = {
                        city: weather.city,
                        country: weather.country,
                        currently: weather.currently,
                        temp: weather.temp,
                        units: {
                            temp: weather.units.temp
                        },
                        icon: icon
                    };

                    self.GUI.render(weather);
                },
                error: function(error) {
                    self.GUI.renderError();
                }
            });

        };

        // Here is an example of simple 'interval' process
        // It can be useful for a widget weather for example
        // Your widget will be refreshed automatically after x seconds
        function Process( cron, interval ){

            this.interval = interval; // Just use an interval
            this.process = 0; // init the process

            // Control your process with these three methods below
            this.start = function(){
                if(this.process == 0){
                    cron();
                    this.process = setInterval( function(){
                        cron();
                    }, this.interval);
                }
            };

            this.stop = function(){
                clearInterval(this.process);
                this.process = 0;
            };

            this.reset = function(){
                this.stop();
                this.start();
            };

        };
        
        this.GUI = {

            RENDER_ERROR_NO_LOCATION: 0,
            
            render: function(weather){
                var skycons = new Skycons({"color": "white"});

                var template = $('#tpl-loaded').html();
                $('#tpl-target').html(_.template(template)({
                    updated: new Date().toISOString(),
                    city: weather.city + ', ' + weather.country,
                    today: 'Today',
                    currently: weather.currently,
                    temperature: weather.temp + '°' + weather.units.temp,
                    option1: self.configuration.options.option1
                }));

                // once template added attach skycon
                // We need to loop because as we have multiple same icon because of responsive
                // skycon must be applied to each one
                $('.icon-current-weather').each(function(){
                    skycons.set(this, weather.icon);
                });
                skycons.play();
            },

            renderError: function(CODE){
                var message;
                switch(CODE){
                    case this.RENDER_ERROR_NO_LOCATION:
                        message = "No valid location provided";
                        break;
                    default:
                        message = "Widget on error";
                }
                var template = $('#tpl-error').html();
                $('#tpl-target').html(_.template(template)({ 
                    title: self.identity,
                    message: message
                }));
            },

            renderRefreshing: function(){
                var template = $('#tpl-refreshing').html();
                $('#tpl-target').html(_.template(template)({ title: self.identity }));
            },

            renderStopped: function(){
                var template = $('#tpl-stop').html();
                $('#tpl-target').html(_.template(template)({ title: self.identity }));
            }
        };

        // Create a date from '5:38 pm' format (this is get by weather.sunset)
        function createDateFromSunset( date ){
            // get date of sunset to compare with our date (day or night for icon)
            var splittedStr = date.split(":"); // 5:38 pm ['5', '38 pm']
            var hours = parseInt(splittedStr[0]);
            var minutes = parseInt(splittedStr[1].split(" ")[0]);
            var period = splittedStr[1].split(" ")[1];
            // set correct hour
            if( period == 'pm' ) hours = 12 + hours;
            // create sunset complete date
            var sunsetDate = new Date();
            sunsetDate.setHours(hours);
            sunsetDate.setMinutes(minutes);
            return sunsetDate;
        }
        
        function getWeatherIcon( currently, isDay ){
            var icon = null;
            switch( currently ){
                case 'Cloudy':
                    icon = Skycons.CLOUDY;
                    break;
                case 'Mostly Cloudy':
                    if( isDay ) icon = Skycons.PARTLY_CLOUDY_DAY;
                    else icon = Skycons.PARTLY_CLOUDY_NIGHT;
                    break;
                case 'Partly Cloudy':
                    if( isDay ) icon = Skycons.PARTLY_CLOUDY_DAY;
                    else icon = Skycons.PARTLY_CLOUDY_NIGHT;
                    break;
                case 'Fair':
                    if( isDay ) icon = Skycons.CLEAR_DAY;
                    else icon = Skycons.CLEAR_NIGHT;
                    break;
                case 'Fog':
                    icon = Skycons.FOG;
                    break;
                case 'Snow':
                    icon = Skycons.SNOW;
                    break;
                case 'Mist':
                    icon = Skycons.FOG;
                    break;
                case 'Rain':
                case 'Heavy Rain':
                case 'Light Rain':
                    icon = Skycons.RAIN;
                    break;
                default:
                    icon = Skycons.CLEAR_DAY;
                    console.warn('weather icon not supported', currently);
                    break;
            }
            return icon;
        }
    };

    document.addEventListener("widget.init", function(e){
        instance = new Widget(e.detail);
    });

    document.addEventListener("widget.start", function(e){
        if(instance) instance.start();
    });

    document.addEventListener("widget.stop", function(e){
        if(instance) instance.stop();
    });

    document.addEventListener("widget.refresh", function(e){
        if(instance) instance.refresh();
    });

})();


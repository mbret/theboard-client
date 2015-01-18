// Weather - http://simpleweatherjs.com


window.Widget = {

    woeid: '',
    unit: 'c',

    iconsMapper: {
        Cloudy: 'Cloud.svg'
    },

    configuration: null,

    init: function( configuration ){
        this.configuration = configuration;
        //console.log(this.configuration.identity + ' is initializing');

        this.start();
    },
    start: function(){
        //console.log(this.configuration.identity + ' is running');
        this.refreshProcess.start();
    },
    stop: function(){
        //console.log(this.configuration.identity + ' is stopped');
        $(".widget-content").html('<span class="waiting">Widget is stopped</span>');
        this.refreshProcess.stop();
    },
    refresh: function(){
        //console.log(this.configuration.identity + ' is refreshing');
        this.refreshProcess.refresh();
    },

    /*
     * Custom function related to the plugin
     */
    getIconURL: function( state ){
        //console.log(state);
        return 'climacons/SVG/' + this.iconsMapper[state]
    },

    refreshProcess : {
        interval: 20000, // 20s
        process: 0,

        start: function(){
            if(this.process == 0){
                Widget.refreshWeather(); // run directly
                this.process = setInterval( Widget.refreshWeather, this.interval);
            }
        },
        stop: function(){
            clearInterval(this.process);
            this.process = 0;
        },
        refresh: function(){
            this.stop();
            this.start();
        }
    },

    /**
     * Warning: We cannot use 'this' as Widget because of the refreshProcess that add a new scope layer
     */
    refreshWeather: function(){
        //var vthis = this;

        $(".widget-content").html('<span class="waiting widget-component-highlighted">Widget is refreshing</span>');
        $('.widget-updated').html();

        $(document).ready(function() {

            var location = Widget.configuration.options.defaultLocation;
            // != check for null & undefined
            if(Widget.configuration.permissions.location != null) location = Widget.configuration.permissions.location.latitude + ',' + Widget.configuration.permissions.location.longitude;

            $.simpleWeather({
                location: location,
                woeid: Widget.woeid,
                unit: Widget.unit,
                success: function(weather) {

                    console.log('DATE', weather);
                    $('.widget-header').html('<h2><canvas id="weather-icon"></canvas> '+weather.temp+'&deg;'+weather.units.temp+'</h2>');
                    $('.widget-content').html(
                        '<ul>' +
                        '<li class="widget-component-highlighted"><span class="glyphicon glyphicon-map-marker" ></span> '+weather.city+', '+weather.country+'</li>'+
                        '<li class="currently widget-component-highlighted">'+weather.currently+'</li>'+
                        '</ul>'
                    );
                    $('.widget-updated').html('Updated: ' + weather.updated );

                    // Set icon with skycons addon
                    var skycons = new Skycons({"color": "white"});
                    var icon = null;
                    // It's the day if now() is before the sunset date
                    var day = moment().isBefore( Widget.createDateFromSunset( weather.sunset ) ) && moment().isAfter( Widget.createDateFromSunset( weather.sunrise ) );

                    switch( weather.currently ){
                        case 'Cloudy':
                            icon = Skycons.CLOUDY;
                            break;
                        case 'Mostly Cloudy':
                            if( day ) icon = Skycons.PARTLY_CLOUDY_DAY;
                            else icon = Skycons.PARTLY_CLOUDY_NIGHT;
                            break;
                        case 'Partly Cloudy':
                            if( day ) icon = Skycons.PARTLY_CLOUDY_DAY;
                            else icon = Skycons.PARTLY_CLOUDY_NIGHT;
                            break;
                        case 'Fair':
                            if( day ) icon = Skycons.CLEAR_DAY;
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
                            console.log(weather.currently);
                            alert('weather.currently not recognized, go write this code madafaka!');
                            break;
                    }
                    skycons.set("weather-icon", icon);
                    skycons.play();
                },
                error: function(error) {
                    $(".weather-widget").html('<p>'+error+'</p>');
                }
            });
        });
    },

    // Create a date from '5:38 pm' format (this is get by weather.sunset)
    createDateFromSunset: function( date ){
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
    },

    displayError: function(){
        $('.widget-content').html(
            '<p>Widget on error</p>'
        );
        $('.widget-updated').html('');
    }
};
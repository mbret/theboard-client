// Weather - http://simpleweatherjs.com




var widget = {

    identity: 'Widget meteo',

    location: 'Toul, FR',
    woeid: '',
    unit: 'c',

    iconsMapper: {
        Cloudy: 'Cloud.svg'
    },

    init: function(){
        console.log(this.identity + ' is initializing');
        this.start();
    },
    start: function(){
        console.log(this.identity + ' is running');
        this.refreshProcess.start();
    },
    stop: function(){
        console.log(this.identity + ' is stopped');
        $("#weather").html('<span class="waiting">Widget is stopped</span>');
        this.refreshProcess.stop();
    },
    refresh: function(){
        console.log(this.identity + ' is refreshing');
        this.refreshProcess.refresh();
    },

    /*
     * Custom function related to the plugin
     */
    getIconURL: function( state ){
        console.log(state);
        return 'climacons/SVG/' + this.iconsMapper[state]
    },

    refreshProcess : {
        interval: 10000, // 3s
        process: 0,

        start: function(){
            if(this.process == 0){
                widget.refreshWeather(); // run directly
                this.process = setInterval( widget.refreshWeather, this.interval);
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

    refreshWeather: function(){
        $("#weather").html('<span class="waiting">Widget is refreshing</span>');
        $(document).ready(function() {
            $.simpleWeather({
                location: widget.location,
                woeid: widget.woeid,
                unit: widget.unit,
                success: function(weather) {
                    //console.log(weather);
                    html = '<h2><canvas id="weather-icon"></canvas> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
                    html += '<ul><li><span class="glyphicon glyphicon-map-marker" ></span> '+weather.city+', '+weather.country+'</li>';
                    html += '<li class="currently">'+weather.currently+'</li>';
                    html += '</ul>';
                    html += '<h3>Updated: ' + weather.updated + '</h3>';

                    $("#weather").html(html);

                    // Set icon with skycons addon
                    var skycons = new Skycons({"color": "white"});
                    var icon = null;
                    // It's the day if now() is before the sunset date
                    var day = moment().isBefore( widget.createDateFromSunset( weather.sunset ) ) && moment().isAfter( widget.createDateFromSunset( weather.sunrise ) );

                    switch( weather.currently ){
                        case 'Cloudy':
                            icon = Skycons.CLOUDY;
                            break;
                        case 'Mostly Cloudy':
                            if( day ) icon = Skycons.PARTLY_CLOUDY_DAY;
                            else icon = Skycons.PARTLY_CLOUDY_NIGHT;
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
    }
}

window.addEventListener('widget-init', function (e) {
    widget.init();
}, false);

window.addEventListener('widget-refresh', function (e) {
    widget.refresh();
}, false);

window.addEventListener('widget-stop', function (e) {
    widget.stop();
}, false);

window.addEventListener('widget-start', function (e) {
    widget.start();
}, false);
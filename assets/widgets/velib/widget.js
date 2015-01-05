/**
 * Here is an object that you can use for test.
 * The library will use it instead of url (which is filled by application automatically)
 *
 */
var widgetConfiguration = {

    widget: {
        configuration: {
            identity: 'Velib Nancy',

            // Require information from user without action from user
            permissions: {
                location: 'Nancy, France'
            },

            // Options are information that can be changed by user
            options: {
                station: {
                    city: "Paris, France",
                    station: "22 RUE DE LA PERLE"
                }
            }
        }
    },

    log: 'debug'

};

(function(){


    window.Widget = {

        configuration: {
            stations: null,
            defaultStation: {
                city: "Nancy, France",
                station: "Boulevard d'Haussonville"
            }
        },

        loadStations: function(cb){
            $.getJSON( "stations.json", function( data ) {
                WidgetUtils.log.debug('Stations.json successfully loaded');
                Widget.configuration.stations = data;
                return cb();
            });
        },

        init: function( conf ){
            this.configuration = _.extend(this.configuration, conf);
            this.initDisplay();
            var vthis = this;
            this.loadStations(function(){
                setTimeout( vthis.start, 1000); // simulate loading to make better effect
            });

        },
        start: function(){
            Widget.refreshProcess.start();
        },
        stop: function(){
            Widget.displayStopped();
            Widget.refreshProcess.stop();
        },
        refresh: function(){
            Widget.displayRefreshing();
            Widget.refreshProcess.refresh();
        },

        refreshProcess : {
            interval: 30000, // 30 s
            process: 0, // init the process

            // Control your process with these three methods below
            start: function(){
                if(this.process == 0){
                    Widget.refreshFunction();
                    this.process = setInterval( Widget.refreshFunction, this.interval);
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

        refreshFunction: function(){
            Widget.displayRefreshing();
            setTimeout( Widget.displayContent, 1000); // simulate some time for very short pull
        },

        initDisplay: function(){
            $('.widget-header').html('<h1>'+this.configuration.identity+'</h1>');
            $('.widget-content').html(
                '<p><span class="widget-component-highlighted">Widget is loading</span></p>'
            );
        },

        displayContent: function(){

            var currentStation = {};

            // Check if options are correct and specified
            if( !Widget.configuration.options.station ){
                var cityStation = Widget.configuration.stations[ Widget.configuration.defaultStation.city ];
                currentStation.city = Widget.configuration.defaultStation.city;
                currentStation.stationName = Widget.configuration.defaultStation.station;
                currentStation.url = cityStation.ws + '/' + cityStation.stations[ Widget.configuration.defaultStation.station ].number;
            }
            else{
                var cityStation = Widget.configuration.stations[ Widget.configuration.options.station.city ];
                currentStation.city = Widget.configuration.options.station.city;
                currentStation.stationName = Widget.configuration.options.station.station;
                currentStation.url = cityStation.ws + '/' + cityStation.stations[ Widget.configuration.options.station.station ].number;
            }

            //console.log( currentStation );

            $.ajax({
                type: "GET",
                url: WidgetUtils.serverURL + "/helpers/cor/" + encodeURIComponent( currentStation.url ),
                data: null,
                dataType: "xml",
                accept: {
                    xml: 'text/xml'
                },
                success: function(xml){
                    WidgetUtils.log.debug('ajax success', xml);
                    $(xml).find('station').each(function()
                    {
                        currentStation.available = $(this).find('available').text();
                        currentStation.total = $(this).find('total').text();
                        currentStation.updated = $(this).find('updated').text();
                    });
                    $('.widget-content').html(
                        '<p>Station ' + currentStation.stationName + ' in '+currentStation.city+',</p>'+
                        '<p><span class="widget-component-highlighted">'+currentStation.available+' available on '+currentStation.total+'</span></p>'
                    );
                    $('.widget-updated').html('Updated: ' + WidgetUtils.convertUnixTsToDate(currentStation.updated).toLocaleString('en-US', { month: 'long', year: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }));
                }
            });

        },

        displayError: function(){
            $('.widget-content').html(
                '<p><span class="widget-component-highlighted">Widget on error</span></p>'
            );
            $('.widget-updated').html('');
        },

        displayRefreshing: function(){
            $('.widget-content').html(
                '<p><span class="widget-component-highlighted">Widget is refreshing</span></p>'
            );
            $('.widget-updated').html('');
        },

        displayStopped: function(){
            $('.widget-content').html(
                '<p><span class="widget-component-highlighted">Widget is stopped</span></p>'
            );
            $('.widget-updated').html('');
        }
    };

})();


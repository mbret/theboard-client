(function(){

    'use strict';

    var instance;
    function Widget( conf ){

        var that = this;
        var self = this;
        var process;
        this.identity = conf.identity;
        // Merge global config with widget scope config
        this.configuration = _.assign({
            process: {
                interval: 500000
            }
        }, conf);

        process = new Process( _fetchData, that.configuration.process.interval );

        /**
         * Start the widget functionaries
         */
        this.start = function(){
            console.log(this.identity + ' is running');
            this.GUI.render();
            process.start();
        };

        /**
         * Stop the widget functionaries
         */
        this.stop = function(){
            console.log(this.identity + ' is stopped');
            this.GUI.displayStopped();
            process.stop();
        };

        /**
         *
         */
        this.refresh = function(){
            console.log(this.identity + ' is refreshing');
            process.reset();
        };

        // This is the 'display refresh method'
        // This method get the needed data (from API for example)
        // Then refresh the display
        function _fetchData(){
            that.GUI.renderRefreshing();
            // do some stuff (get info from google API ?)
            // ...
            setTimeout( function(){
                that.GUI.render();
            }, 1000);
        };

        // Here is an example of simple 'interval' process
        // It can be useful for a widget weather for example
        // Your widget will be refreshed automatically after x seconds
        function Process( fn, interval ){

            this.interval = interval, // Just use an interval
                this.process = 0, // init the process

                // Control your process with these three methods below
                this.start = function(){
                    if(this.process == 0){
                        fn();
                        this.process = setInterval( function(){
                            fn();
                        }, this.interval);
                    }
                },

                this.stop = function(){
                    clearInterval(this.process);
                    this.process = 0;
                },

                this.reset = function(){
                    this.stop();
                    this.start();
                }

        };

        this.GUI = {

            render: function(){
                var skycons = new Skycons({"color": "white"});

                var template = $('#tpl-loaded').html();
                $('#tpl-target').html(_.template(template)({
                    updated: new Date().toISOString(),
                    option1: self.configuration.options.option1
                }));

                skycons.set("icon-current-weather", Skycons.CLEAR_DAY);
                skycons.set("icon-weather-1", Skycons.CLEAR_DAY);
                skycons.set("icon-weather-2", Skycons.CLEAR_DAY);
                skycons.set("icon-weather-3", Skycons.CLEAR_DAY);
                skycons.set("icon-weather-4", Skycons.CLEAR_DAY);
                skycons.set("icon-weather-5", Skycons.CLEAR_DAY);
                skycons.set("icon-weather-6", Skycons.CLEAR_DAY);
                skycons.set("icon-weather-7", Skycons.CLEAR_DAY);
                skycons.play();
            },

            renderError: function(){
                var template = $('#tpl-error').html();
                $('#tpl-target').html(_.template(template)({ title: self.identity }));
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

    };

    document.addEventListener("widget.init", function(e){
        //console.log('widget.init', e);
        instance = new Widget(e.detail);
    });

    document.addEventListener("widget.start", function(e){
        //console.log('widget.start', e);
        if(instance) instance.start();
    });

    document.addEventListener("widget.stop", function(e){
        //console.log('widget.stop', e);
        if(instance) instance.stop();
    });

    document.addEventListener("widget.refresh", function(e){
        //console.log('widget.refresh', e);
        if(instance) instance.refresh();
    });

})();


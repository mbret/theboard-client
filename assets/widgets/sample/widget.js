(function(){
    'use strict';
    
    var instance;
    var Widget = function( conf ){

        var self = this;
        this.process;
        this.identity = conf.identity;
        // Merge global config with widget scope config
        this.configuration = _.assign({
            process: {
                interval: 5000
            }
        }, conf);

        self.process = new Process( _fetchData, self.configuration.process.interval );
        
        this.updateConfig = function(newConfig){
            // @todo
        };
        
        /**
         * Start the widget
         * - start the bg process
         */
        this.start = function(){
            //console.log(this.identity + ' is running');
            self.process.start();
        };

        /**
         * Stop the widget
         * - stop the bg process
         */
        this.stop = function(){
            //console.log(self.identity + ' is stopped');
            this.GUI.renderStopped();
            self.process.stop();
        };

        /**
         * Refresh the widget
         * - reset the bg refresh (simulate restart)
         */
        this.refresh = function(){
            //console.log(this.identity + ' is refreshing');
            self.process.reset();
        };

        // This object control only the render
        // There are several render state (ok, refreshing, ...)
        this.GUI = {

            render: function(){
                var template = $('#tpl-loaded').html();
                $('#tpl-target').html(_.template(template)({
                    title: self.identity ,
                    updated: new Date().toISOString(),
                    option1: self.configuration.options.option1
                }));
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
        
        // This is the 'display refresh method'
        // This method get the needed data (from API for example)
        // Then refresh the display
        function _fetchData(){
            self.GUI.renderRefreshing();
            // do some stuff (get info from google API ?)
            // ...
            setTimeout( function(){
                self.GUI.render();
            }, 1000);
        };

        // Here is an example of simple 'interval' process
        // It can be useful for a widget weather for example
        // Your widget will be refreshed automatically after x seconds
        function Process( fn, interval ){
            var self = this;
            
            this.interval = interval, // Just use an interval
            self.process = 0, // init the process
    
            // Control your process with these three methods below
            self.start = function(){
                if(self.process == 0){
                    fn();
                    self.process = setInterval( function(){
                        fn();
                    }, self.interval);
                }
            };

            self.stop = function(){
                clearInterval(self.process);
                self.process = 0;
            };

            self.reset = function(){
                self.stop();
                self.start();
            };
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



/**
 * Here is an object that you can use for test.
 * The library will use it instead of url (which is filled by application automatically)
 *
 */
window.widgetConfiguration = {

    widget: {

        configuration: {
            identity: 'Velib Nancy',

            // Require information from user without action from user
            permissions: {
                location: 'Nancy, France'
            },

            // Options are information that can be changed by user
            // As they are used by application you can only specify here the values
            options: {
                option1: "Nancy"
            }
        }
    },

    log: 'debug'
};

(function(){

    'use strict';
    
    /**
     * Widget definition
     *
     * ==============
     * Your widget
     * ==============
     * Your widget must implement init() method. Otherwise the widget will not be handle by library.
     *
     * Your widget can be build in the way you want. It's however recommended to follow this structure
     *
     * widget.start()   => This method start your widget
     * widget.refresh()   => This method refresh your widget
     * widget.stop()    => This method stop your widget
     * ...
     *
     * Once your widget is build, the library will call init() method and pass data.
     *
     * ==============
     * WidgetAdapter
     * ==============
     * A WidgetAdapter is also passed through window by the library
     * WidgetAdapter contain some info and more important the settings your widget asked
     * Example:
     *  WidgetAdapter.signal    => Contain the current signal
     *  WidgetAdapter.widget    => Contain all your widget configuration
     *  WidgetAdapter.widget.settings  => Contain informations you asked
     *  WidgetAdapter.widget.identity  => Contain your widget identity
     *  ...
     *
     */
    var Widget = function( conf ){

        var that = this;
        var process;
        var configuration = _.assign({
            process: {
                interval: 5000
            }
        }, conf);

        process = new Process( _fetchData, configuration.process.interval );
        
        /**
         * Start the widget functionaries
         */
        this.start = function(){
            WidgetUtils.log.debug(this.identity + ' is running');
            this.GUI.start();
            process.start();
        };

        /**
         * Stop the widget functionaries 
         */
        this.stop = function(){
            WidgetUtils.log.debug(this.identity + ' is stopped');
            this.GUI.displayStopped();
            process.stop();
        };

        /**
         *
         */
        this.refresh = function(){
            WidgetUtils.log.debug(this.identity + ' is refreshing');
            process.reset();
        };

        // This is the 'display refresh method'
        // This method get the needed data (from API for example)
        // Then refresh the display
        function _fetchData(){
            that.GUI.displayRefreshing();
            // do some stuff (get info from google API ?)
            // ...
            setTimeout( function(){
                that.GUI.displayContent();
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
        
        /**
         * This object control the GUI
         * @type {{init: Function, displayContent: Function, displayError: Function, displayRefreshing: Function, displayStopped: Function}}
         */
        this.GUI = {
            
            start: function(){
                $('.widget-header').html('<h1>'+ configuration.identity + '</h1>');
                $('.widget-content').html(
                    '<p>Widget is loading</p>'
                );
            },

            displayContent: function(){
                $('.widget-content').html(
                    '<p>Sunday 21 December 2014,'+
                    '</br><span class="widget-component-highlighted">Option 1 is: '+ configuration.options.option1+'</span></p>'
                );
                $('.widget-updated').html('Updated: ' + new Date().toISOString());
            },

            displayError: function(){
                $('.widget-content').html(
                    '<p>Widget on error</p>'
                );
                $('.widget-updated').html('');
            },

            displayRefreshing: function(){
                $('.widget-content').html(
                    '<p>Widget is refreshing</p>'
                );
                $('.widget-updated').html('');
            },

            displayStopped: function(){
                $('.widget-content').html(
                    '<p>Widget is stopped</span></p>'
                );
                $('.widget-updated').html('');
            }
        };

    };
    // export
    window.Widget = Widget;

})();


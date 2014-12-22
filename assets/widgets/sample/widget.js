(function(){

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
    window.Widget = {

        configuration: null,

        // This method is call by the library
        init: function( configuration ){
            this.configuration = configuration;
            console.log(this.identity + ' is initializing');
            console.log('Here is the widget adapter', WidgetAdapter);
            this.initDisplay();
            this.start();
        },
        // This method will be call when widget should be start
        start: function(){
            console.log(this.identity + ' is running');
            this.refreshProcess.start();
        },
        // ...
        stop: function(){
            console.log(this.identity + ' is stopped');
            this.displayStopped();
            this.refreshProcess.stop();
        },
        // ...
        refresh: function(){
            console.log(this.identity + ' is refreshing');
            this.displayRefreshing();
            this.refreshProcess.refresh();
        },

        // Here is an example of simple 'interval' process
        // It can be useful for a widget weather for example
        // Your widget will be refreshed automatically after x seconds
        refreshProcess : {
            interval: 2000000, // Just use an interval
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

        // This is the 'display refresh method'
        // This method get the needed data (from API for example)
        // Then refresh the display
        refreshFunction: function(){
            // do some stuff (get info from google API ?)
            // ...
            setTimeout(this.displayContent, 1000);
        },

        initDisplay: function(){
            $('.widget-header').html('<h1>'+this.configuration.identity+'</h1>');
            $('.widget-content').html(
                '<p>Widget is loading</p>'
            );
        },

        displayContent: function(){
            $('.widget-content').html(
                '<p>Sunday 21 December 2014,'+
                '</br><span class="widget-component-highlighted">the weather seems clear!</span></p>'
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


    /*
     * Here is a list of listener you can use to intercept signal from application
     * The application may send to the widget many signal like (stop/start/...)
     * The library will act as a bridge between you and the application
     * These are the available listeners:
     */
    // You can just simply link these listener to your widget methods start/stop/...
    // It's a good way to allow user to control a bit your widget
    window.addEventListener('widget-refresh', function (e) {
        Widget.refresh();
    }, false);

    window.addEventListener('widget-stop', function (e) {
        Widget.stop();
    }, false);

    window.addEventListener('widget-start', function (e) {
        Widget.start();
    }, false);

})();


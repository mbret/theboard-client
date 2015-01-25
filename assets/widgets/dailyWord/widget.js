/**
 * Created by Damien on 25/01/2015.
 */

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

        //identity: foo // filled by library
        configuration: null,

        // This method is call by the library
        init: function( conf ){
            this.configuration = conf;
            WidgetUtils.log.debug(this.identity + ' is initializing');
            this.initDisplay();
            this.start();
        },
        // This method will be call when widget should be start
        start: function(){
            WidgetUtils.log.debug(this.identity + ' is running');
            this.refreshProcess.start();
        },
        // ...
        stop: function(){
            WidgetUtils.log.debug(this.identity + ' is stopped');
            this.displayStopped();
            this.refreshProcess.stop();
        },
        // ...
        refresh: function(){
            WidgetUtils.log.debug(this.identity + ' is refreshing');
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
            Widget.getDailyWord();
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
        },

        getDailyWord: function(){
            google.load('feeds', '1', {callback : function(){
                Widget.getFeed();
            }});
        },

        getFeed: function() {
            var feed = new google.feeds.Feed("http://unmotparjour.fr/feed/");
            feed.load(function (result) {
                if (!result.error) {
                    $('.widget-header').html(
                        '<h1>Mot du jour</h1>'
                    );
                    $('.widget-content').html(
                        '<p>'+result.feed.entries[0].title+' : <br />'+result.feed.entries[0].content+'</p>'
                    );
                }
            });
        }
    };

})();


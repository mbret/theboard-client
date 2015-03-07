var widget = {

    identity: 'Widget sample',

    /*
     * Function to handle main application
     */
    init: function(){
        //console.log(this.identity + ' is initializing');
        this.start();
    },
    start: function(){
        //console.log(this.identity + ' is running');
        this.refreshProcess.start();
    },
    stop: function(){
        //console.log(this.identity + ' is stopped');
        document.getElementById("sample").innerHTML = 'Widget is stopped';
        this.refreshProcess.stop();
    },
    refresh: function(){
        //console.log(this.identity + ' is refreshing');
        this.refreshProcess.refresh();
    },

    /*
     * Custom function related to the plugin
     */
    refreshProcess : {
        interval: 10000, // 3s
        process: 0,

        start: function(){
            if(this.process == 0){
                widget.refreshFunction();
                this.process = setInterval( widget.refreshFunction, this.interval);
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
        html = '<h2>' + widget.identity + '</h2>';
        html += '<div class="updated">Updated: ' + new Date().toISOString() + '</div>';
        document.getElementById("sample").innerHTML = html;
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
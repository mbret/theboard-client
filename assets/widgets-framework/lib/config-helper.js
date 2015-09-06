(function(){
    var configHelper = function(){

        var utils = window.theboardUtils;

        this.loadWidgetConfiguration = function(providedWidgetConfig){
console.log(providedWidgetConfig);
            // ===============
            // Some init
            // widgetConfiguration is an object that can be create by widget creator to
            // overwrite some settings
            // ===============
            if( providedWidgetConfig && _.isObject(providedWidgetConfig) ){
                //console.log('Substitute configuration provided by user. Use it instead of default library configuration!');
                if( providedWidgetConfig.widget && providedWidgetConfig.widget.configuration){
                    var testWidgetProvided = providedWidgetConfig.widget;
                    return testWidgetProvided.configuration;
                }
            }
            else{
                console.log('No substitute configuration provided by user. Use default library configuration!');
            }

            // ===============
            // STEP 1
            // ===============
            // Get eventual settings from application
            // The first run a settings object may be passed by application
            var tmp = utils.getUrlVars();

            if( !tmp.widget){
                throw new Error("No widget configuration specified into URL");
            }
            if( ! utils.checkValidityOfJsonFromUrl( tmp.widget )){
                throw new Error("Please specify a valid widget configuration");
            }
            return JSON.parse(tmp.widget);
        }
    };

    // export
    window.configHelper = new configHelper();
})();
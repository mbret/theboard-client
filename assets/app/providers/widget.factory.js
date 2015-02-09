(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app.services')
        .factory('Widget', Widget);

    Widget.$inject = ['$window', '$http', 'APP_CONFIG', 'logger', 'notifService', '$injector'];

    /**
     * This is a Widget model factory
     *
     */
    function Widget($window, $http, APP_CONFIG, logger, notifService, $injector) {
        var Widget = function(widget){
            this.id = widget.id;
            this.iframeURL = widget.iframeURL;
            this.oldState;
            
            // @todo remove it and set all attribute in hard
            for(var prop in widget){
                this[prop] = widget[prop];
            }
            
            var state = null;
            this.options = widget.options ? widget.options : [];
            this.saveState(); // keep trace of current state
        }
        Widget.prototype.__defineGetter__("STATE_RELOADING", function(){ return 'reloading' });
        Widget.prototype.hasOptions = hasOptions;
        Widget.prototype.saveOptions = saveOptions;
        Widget.prototype.getOptionValue = getOptionValue;
        Widget.prototype.getState = getState;
        Widget.prototype.setState = setState;
        Widget.prototype.buildIframeURL = buildIframeURL;
        
        function setState(state){

        }
        
        function getState(){
            
        }
        
        /**
         * Save the current state like position, size etc
         */
        Widget.prototype.saveState = function(){
            this.oldState = {
                sizeX: this.sizeX,
                sizeY: this.sizeY,
                row: this.row,
                col: this.col
            }
        }

        function getOptionValue(id){
            var optionValue = null;
            angular.forEach(this.options, function(option){
                if(option.id === id){
                    optionValue = option.value;
                }
            });
            return optionValue;
        };
        
        Widget.prototype.setOptionValue = function(id, value){
            angular.forEach(this.options, function(option){
                if(option.id === id){
                    option.value = value;
                }
            })
        };

        /**
         * Take an associative array of options
         * @param options
         */
        Widget.prototype.setOptionsValues = function(options){
            var that = this;
            angular.forEach(options, function(value, id){
                that.setOptionValue(id, value);
            });
        };

        function buildIframeURL(){
            // prepare options for widget
            var options = {};
            angular.forEach(this.options, function(option, index){
                options[option.id] = option.value;
            });

            // Prepare finally the widget conf to send to widget
            // It contain only needed information
            var configuration = {
                identity: this.identity,
                identityHTML: this.identityHTML,
                permissions: this.permissions,
                options: options
            };
            var URI = $window.URI(this.baseURL).search({widget:JSON.stringify(configuration)}).toString();
            this.iframeURL = URI;
            logger.debug('Widget build its URL', URI);
        }
        

        /**
         * Check if the widget has options
         * @returns {boolean}
         */
        function hasOptions(){
            return this.options.length > 0;
        }

        /**
         * Save the current widget options
         * Save it to server
         * @returns {*}
         */
        function saveOptions(){
            var that = this;
            return this._save({
                options: that.options
            });
        };

        Widget.prototype.save = function(){
            return this._save({
                sizeX: this.sizeX,
                sizeY: this.sizeY,
                row: this.row,
                col: this.col,
                options: this.options
            });
        };

        /**
         * Function that handle the widget update on action
         * - Get the new widget
         * - Compare this widget to all other widgets
         * - Check the equality between this widget and the list of previous widget
         * 	if one eq found 	=> this widget has not been dragged or resized (the old is equal to the new)
         *	if no eq found 		=> this widget is new so update it
         *
         * - When success we also update the widget in previous state etc
         * @todo remove use of notifService and return a promise (always)
         */
        Widget.prototype.updateIfStateChanged = function(){
            var that = this;
            var key = null;
            if( this.hasStateChanged() ){
                return $injector.get('dataservice').updateWidget( that )
                    .then(function( widgetUpdated ){
                        notifService.success( APP_CONFIG.messages.widgets.updated );
                        that.saveState();
                    })
                    .catch(function(err){
                        notifService.error( err.message );
                    });
            }
            return false;
        }
        
        Widget.prototype.hasStateChanged = function(){
            return (this.col !== this.oldState.col
            || this.row !== this.oldState.row
            || this.sizeX !== this.oldState.sizeX
            || this.sizeY !== this.oldState.sizeY);
        }
        
        /*
         * Private methods
         */

        Widget.prototype._save = function(data){
            return $http.put(APP_CONFIG.routes.widgets.update + '/' + this.id, data)
                .then(function(data) {
                    logger.debug('Widget updated successfully!', data.data);
                    return data.data;
                })
                .catch(function(err) {
                    logger.error('Failure while updating widget', err);
                    throw new Error(APP_CONFIG.messages.errors.widgets.unableToUpdate);
                });
        };

        return Widget;
    }

})();
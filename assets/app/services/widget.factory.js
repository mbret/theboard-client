(function () {
    'use strict';

    /**
     *
     */
    angular
        .module('app')
        .factory('Widget', Widget);

    Widget.$inject = ['$window', '$http', 'config', 'logger', 'notifService', '$injector'];

    /**
     * This is a Widget model factory
     *
     */
    function Widget($window, $http, config, logger, notifService, $injector) {
        var Widget = function(widget){
            this.id = widget.id;
            this.iframeURL = widget.iframeURL;
            this.oldState;
            
            // @todo remove it and set all attribute in hard
            for(var prop in widget){
                this[prop] = widget[prop];
            }
            
            this.saveState(); // keep trace of current state
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

        /**
         * WARNING: if you linked the url to an iframe you will occur an iframe reload
         */
        Widget.prototype.rebuildIframeURL = function(){
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
            this.iframeURL = $window.URI(this.baseURL).search({widget:JSON.stringify(configuration)}).toString();
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
                        notifService.success( config.messages.widgets.updated );
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
            return $http.put(config.routes.widgets.update + '/' + this.id, data)
                .then(function(data) {
                    logger.debug('Widget updated successfully!', data.data);
                    return data.data;
                })
                .catch(function(err) {
                    logger.error('Failure while updating widget', err);
                    throw new Error(config.messages.errors.widgets.unableToUpdate);
                });
        };

        return Widget;
    }

})();
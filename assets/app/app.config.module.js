(function () {

    'use strict';

    angular.module('app.config',[])
    .constant('_', _)
    /**
     * config get injected by 'app' as a constant when config is retrieved from server
     */
    .config(function configureConfig(APP_CONFIG, _){
        // deep merge
        _.merge(APP_CONFIG, {
            appErrorPrefix: '[Board: Error] ',
            routes: {
                templates: APP_CONFIG.routes.views + '/templates',
                partials: APP_CONFIG.routes.views + '/partials'
            },
            gridsterOpts: {
                columns: 6, // the width of the grid, in columns
                width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
                colWidth: 300, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                margins: [20, 20], // the pixel distance between each widget
                outerMargin: true, // whether margins apply to outer edges of the grid,
                floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
                resizable: {
                    enabled: false,
                    handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                    start: function(event, $element, widget) {}, // optional callback fired when resize is started,
                    resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
                    stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
                },
                draggable: {
                    enabled: false, // whether dragging items is supported
                    handle: '.gridster-draggable', // optional selector for resize handle
                    start: function(event, $element, widget) {}, // optional callback fired when drag is started,
                    drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
                    stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
                }
            }
        });
    });

})();

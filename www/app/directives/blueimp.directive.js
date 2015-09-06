(function(){
    'use strict';

    /**
     *
     */
    angular
        .module('app.directives')
        .directive('blueimp', blueimp);

    blueimp.$inject = ['$timeout', 'blueimp'];

    /**
     *
     */
    function blueimp ($timeout, blueimp){

        return {
            restrict: 'A',
            link: function($scope, element, $attrs) {

                return $timeout(function() {

                    var Gallery = blueimp.Gallery;
                    
                    element.bind('click', function(event){
                        event.stopPropagation();
                        
                        // Get the container id from the data-gallery attribute:
                        var id = element.data('gallery'),
                            widget = angular.element(id),
                            container = (widget.length && widget) ||
                                angular.element(Gallery.prototype.options.container),
                            callbacks = {
                                onopen: function () {
                                    angular.element('.wrapper-content').addClass('cancel-animation');
                                    container
                                        .data('gallery', this)
                                        .trigger('open');
                                },
                                onopened: function () {
                                    container.trigger('opened');
                                },
                                onslide: function () {
                                    container.trigger('slide', arguments);
                                },
                                onslideend: function () {
                                    container.trigger('slideend', arguments);
                                },
                                onslidecomplete: function () {
                                    container.trigger('slidecomplete', arguments);
                                },
                                onclose: function () {
                                    container.trigger('close');
                                },
                                onclosed: function () {
                                    container
                                        .trigger('closed')
                                        .removeData('gallery');
                                }
                            },
                            options = $.extend(
                                // Retrieve custom options from data-attributes
                                // on the Gallery widget:
                                container.data(),
                                {
                                    container: container[0],
                                    index: this,
                                    event: event
                                },
                                callbacks
                            );
                        // Select all links with the same data-gallery attribute:
                        var links = angular.element('[data-gallery="' + id + '"]');

                        if (options.filter) {
                            links = links.filter(options.filter);
                        }
                        
                        return new Gallery(links, options);
                    });
                });
            }
        };
    }
})();

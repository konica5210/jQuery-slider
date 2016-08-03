// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "defaultPluginName",
			defaults = {
				propertyName: "value",
				controlsClass: ".controls",
				slidesClass: ".slides",
				paginationClass: ".pagination"
			};

		// The actual plugin constructor
		function Plugin (element, options) {
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend({}, defaults, options);
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				this.setProperties();
				this.slideRight();
				this.slideLeft();				
			},
			slideRight: function() {
						var _this = this;
						$(_this._defaults.controlsClass+" "+"li:last-child").click(
							function() {
								if (Math.abs((_this.convertStringToInteger($(_this._defaults.slidesClass).css("right")))-
									 (_this.getMaxSlideDistance())) < 30) {
									//go to first slide, when slideshow has reached max distance
									$(_this._defaults.slidesClass).animate({right: '0%'}, 500);
								} else {
									//go to next slide
									$(_this._defaults.slidesClass).animate({right: '+=100%'}, 500);
								}
							})
			},
			slideLeft: 	function() {
						var _this = this;
						$(_this._defaults.controlsClass + " " + "li:first-child").click(	
							function() {
								if ((_this.convertStringToInteger($(_this._defaults.slidesClass).css("right"))) < 30) {
									//go to last slide, when slideshow has reached starting point
									$(_this._defaults.slidesClass).animate({right: (_this.getMaxSlidePercentage()-100).toString()+"%"}, 500);
								} else {
									//go to next slide
									$(_this._defaults.slidesClass).animate({right: '-=100%'}, 500);
								}
							})
			},
			getNumberOfSlides: function() {
				return $(this._defaults.slidesClass).children().length
			},
			getSlideWidth: function() {
				return $(this._defaults.slidesClass + " " + "li").width()
			},
			getMaxSlideDistance: function() {
				return ((this.getNumberOfSlides()-1)*this.getSlideWidth())
			},
			getMaxSlidePercentage: function() {
				return this.getNumberOfSlides()*100
			},
			convertStringToInteger: function(string) {
				return parseInt((string).replace(/[^0-9.]/g, ''))
			},
			setProperties: function() {
				$(this._defaults.slidesClass).css("width", this.getMaxSlidePercentage().toString()+"%");
				$(this._defaults.slidesClass+" "+"li").css("width", (100/this.getNumberOfSlides()).toString()+"%")
			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );

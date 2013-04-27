/*global define */

define(
[
	'view/directives/common'
],
function (commonDirectives) {
	'use strict';
	return {
		'id' : {
			id : function () {
				return 'Bookable' + this.id;
			},
			text : function () {
				return '';
			}
		},
		'bookable-title' : commonDirectives.titleDirective,
		'bookable-description' : commonDirectives.descriptionDirective,
		'entityId' : commonDirectives.getEntityDirective('bookable'),
		'price' : {
			'text': function () {
				var l = this.prices[model.language].values.length;
				return this.prices[model.language].values[l - 1];
			}
		},
		'currency' : {
			'text': function () {
				return this.prices[model.language].currency;
			}
		},
		'price-for-guests' : {
			'text': function (params) {
				var $el = $(params.element);
				return $el.text().replace(/#NR#/, this.places);
			}
		},
		'album_url' : {
			'text' : function () {
				return '';
			},
			'class' : function () {
				return 'bookable-picaslide picaslide';
			},
			'data-picaslide-username' : function () {
				var m = /.com(\/photos)?\/(\d+)/.exec(this.album_url);
				return this.album_url && m && m.length > 2 ? m[2] : '';
			},
			'data-picaslide-albumid' : function () {
				var m = /.com(\/photos)?\/\d+(\/albums)?\/([^\/?#]+)/.exec(this.album_url);
				return this.album_url && m && m.length > 3 ? m[3] : '';
			},
			'data-picaslide-width' : function () {
				return '400px';
			},
			'data-picaslide-height' : function () {
				return '300px';
			}
		}
	};
});
/*global define */
/*global $ */

define(
[
	'view/directives/common',
	'lib/jquery'
],
function (commonDirectives) {
	'use strict';
	return {
		'id' : {
			id : function () {
				return 'BookableVariant' + this.id;
			},
			text : function () {
				return '';
			}
		},
		'entityId' : commonDirectives.getEntityDirective('bookable-variant'),
		'bookable-variant-description' : commonDirectives.descriptionDirective,
		'bookable-variant-album_url' : {
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
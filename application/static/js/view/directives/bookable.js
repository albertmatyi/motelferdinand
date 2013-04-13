/*global define */

define(
[
	'view/directives/common'
],
function (commonDirectives) {
	'use strict';
	return {
		'id' : {
			id : function (params) {
				return 'Bookable' + this.id;
			},
			text : function (params) {
				return '';
			}
		},
		'bookable-title' : commonDirectives.titleDirective,
		'bookable-description' : commonDirectives.descriptionDirective,
		'entityId' : commonDirectives.getEntityDirective('bookable'),
		'album_url' : {
			'text' : function (params) {
				return '';
			},
			'class' : function (params) {
				return 'bookable-picaslide picaslide';
			},
			'data-picaslide-username' : function (params) {
				var m = /.com(\/photos)?\/(\d+)/.exec(this.album_url);
				return this.album_url && m && m.length > 2 ? m[2] : '';
			},
			'data-picaslide-albumid' : function (params) {
				var m = /.com(\/photos)?\/\d+(\/albums)?\/([^\/?#]+)/.exec(this.album_url);
				return this.album_url && m && m.length > 3 ? m[3] : '';
			},
			'data-picaslide-width' : function (params) {
				return '400px';
			},
			'data-picaslide-height' : function (params) {
				return '300px';
			}
		}
	};
});
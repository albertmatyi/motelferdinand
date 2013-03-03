/*global define */
/*global $ */

define(
[
	'view/directives/common'
],
function (commonDirectives) {
	"use strict";
	return {
		id : {
			id : function (params) {
				return 'Content' + this.id;
			},
			text : function (params) {
				return '';
			}
		},
		'content-title' : commonDirectives.titleDirective,
		'content-description' : commonDirectives.descriptionDirective,
		'entityId' : commonDirectives.getEntityDirective('content')
	};
});
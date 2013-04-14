/*global define */

define(
[
	'view/directives/common'
],
function (commonDirectives) {
	'use strict';
	return {
		id : {
			id : function () {
				return 'Content' + this.id;
			},
			text : function () {
				return '';
			}
		},
		'content-title' : commonDirectives.titleDirective,
		'content-description' : commonDirectives.descriptionDirective,
		'entityId' : commonDirectives.getEntityDirective('content')
	};
});
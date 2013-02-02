define([
	'view/directives/content',
	'view/directives/bookable',
	'view/directives/common',
], 
function(contentDirective, bookableDirective, commonDirectives) {
	return {
		'id' : {
			id : function(params) {
				return 'Category' + this.id;
			},
			text : function(params) {
				return '';
			},
		},
		'entityId' : commonDirectives.getEntityDirective('category'),
		'category-title' : commonDirectives.titleDirective,
		'category-description' : commonDirectives.descriptionDirective,
		'contents' : contentDirective,
		'bookables' : bookableDirective,
		'category-booking-id' :{
			'id' : function(params) {
				return 'bookBtn'+this.id;
			},
			'text' : function (params){
				return params.element.text;
			}
		}
	}
}
);
define([
		'controllers/booking',
		'view/directives/content',
		'view/directives/bookable',
		'view/directives/common',
	], 
	function(booking, contentDirective, bookableDirective, commonDirectives) {
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
				},
				'onclick' : function(params){
					var categoryId = this.id;
					$(params.element).click(function(){
						booking.showForm(categoryId);
						$(this).hide();
						return false;
					});
				}
			}
		}
	}
);
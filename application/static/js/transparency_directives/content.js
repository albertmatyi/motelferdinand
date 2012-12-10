define(['booking'], function(booking) {
	var descriptionDecorator = {
		text : function (params) {
			return '';
		},
		html : function(params) {
			return this.description;
		}
	};
	var titleDecorator = {
			text : function (params) {
				return this.title;
			},
		};
	return {
		contentDirective : {
			id : {
				id : function(params) {
					return 'Category' + this.id;
				},
				text : function(params) {
					return '';
				},
			},
			entityId: {
				text : function (params){
					return '';
				},
				'data-category-id' : function(params){
					return this.id;
				},
				'data-category-idx' : function(params){
					return params.index;
				}
			},
			'category-title' : titleDecorator,
			'category-description' : descriptionDecorator,
			contents : {
				id : {
					id : function(params) {
						return 'Content' + this.id;
					},
					text : function(params) {
						return '';
					}
				},
				'content-title' : titleDecorator,
				'content-description' : descriptionDecorator
			},
			bookables : {
				'bookable-title' : titleDecorator,
				'bookable-description' : descriptionDecorator,
				album_url : {
					text : function(params) {
						return '';
					},
					'class' : function(params) {
						return 'bookable-picaslide picaslide';
					},
					'data-picaslide-username' : function(params) {
						return this.album_url ? /.com(\/photos)?\/(\d+)/
								.exec(this.album_url)[2] : '';
					},
					'data-picaslide-albumid' : function(params) {
						return this.album_url ? /.com(\/photos)?\/\d+(\/albums)?\/([^\/#]+)/
								.exec(this.album_url)[3]
								: '';
					},
					'data-picaslide-width' : function(params) {
						return '400px';
					},
					'data-picaslide-height' : function(params) {
						return '300px';
					}
				}
			},
			'category-booking-id' :{
				id : function(params) {
					return 'bookBtn'+this.id;
				},
				text : function (params){
					return params.element.text;
				},
				onclick : function(params){
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
});
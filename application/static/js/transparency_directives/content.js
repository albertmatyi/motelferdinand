define({
	contentDirective : {
		id : {
			id : function(params) {
				return 'Category' + this.id;
			},
			text : function(params) {
				return '';
			}
		},
		contents : {
			description : {
				html : function(params) {
					return this.description;
				}
			}
		},
		bookables : {
			description : {
				html : function(params) {
					return this.description;
				}
			},
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
			},
			quantity : {
				html : function(params) {
					var html = '';
					for ( var i = 0; i <= this.quantity; i++) {
						html += '<option value="' + i + '">' + i + '</option>'
					}
					return html;
				},
				name : function(params) {
					return 'Bookable-' + this.id + '-quantity';
				},
				id : function(params) {
					return 'Bookable-' + this.id + '-quantity';
				}
			}
		}
	}
});
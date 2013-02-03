define(
[
	'view/directives/common'
],
function(commonDirectives){
	return {
		'id' : {
			id : function(params) {
				return 'Bookable' + this.id;
			},
			text : function(params) {
				return '';
			}
		},
		'bookable-title' : commonDirectives.titleDirective,
		'bookable-description' : commonDirectives.descriptionDirective,
		'entityId' : commonDirectives.getEntityDirective('bookable'),
		'album_url' : {
			'text' : function(params) {
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
	};
});
define(
[
	'lib/jquery',
	'lib/transparency'
], 
function(){
	
	var languageDirective={
		'name' : {
			'text' : function(params){
				var lang_id = this.lang_id;
				$(params.element).click(function (){
					cookies.set('lang_id', lang_id);
					console && console.log && console.log('setting cookie lang_id='+ lang_id);
					window.location = '/';
				});
				return this.name;
			}
		}
	}

	$('.language.dropdown-menu').render(model.languages, languageDirective);
});
var toolbarDirective = {
		id:{
			id: function (param){ 
				return 'wysihtml5-toolbar-'+$(this)[0].id;
			}
		}
};


$(window).load(function() {
	tas = $('textarea');
	$('#wysihtml5-toolbars').render(tas, toolbarDirective);
	$(tas).each(function (idx, el){
		$(el).parent().parent().prepend($('#wysihtml5-toolbar-'+el.id));
		new wysihtml5.Editor(el.id, { // id of textarea element
			  toolbar:      'wysihtml5-toolbar-'+el.id, // id of toolbar element
			  parserRules:  wysihtml5ParserRules // defined in parser rules set 
			});
	});
});
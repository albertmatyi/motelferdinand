var toolbarDirective = {
		id:{
			id: function (param){ 
				return 'wysihtml5-toolbar-'+$(this)[0].id;
			}
		}
};


$(window).load(function() {
	tas = $('textarea');
	$(tas).each(function (idx, el){
		$(el).wysihtml5(
				{ parserRules: wysihtml5ParserRules }
				);
	});
});
var HeaderFixer = {
		'scrollListener': function(event){
			if($(window).scrollTop() > HeaderFixer.headerPos){
				HeaderFixer.$header.addClass('navbar-fixed-top');
				HeaderFixer.$palceholder.show();
			}else{
				HeaderFixer.$header.removeClass('navbar-fixed-top');
				HeaderFixer.$palceholder.hide();
			}
		},
		'activate': function(){
			HeaderFixer.$header = $('#header .navbar');
			HeaderFixer.$palceholder = $('#header .nav-placeholder');
			HeaderFixer.headerPos = HeaderFixer.$header.offset().top;
			$(window).scroll(HeaderFixer.scrollListener);
		}		
}
var HeaderFixer = {
		'scrollListener': function(event){
			console.log(event);
			if($(window).scrollTop() > HeaderFixer.headerPos){
				HeaderFixer.$header.addClass('navbar-fixed-top');
			}else{
				HeaderFixer.$header.removeClass('navbar-fixed-top');
			}
		},
		'activate': function(){
			HeaderFixer.$header = $('#header .navbar');
			HeaderFixer.headerPos = HeaderFixer.$header.offset().top;
			$(window).scroll(HeaderFixer.scrollListener);
		}		
}
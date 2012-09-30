var HeaderFixer = {
	'scrollListener' : function(event) {
		var atTop = $(window).scrollTop() <= HeaderFixer.headerPos;
		if (!atTop && !HeaderFixer.$header.hasClass('navbar-fixed-top')) {
			HeaderFixer.$header.addClass('navbar-fixed-top');
			HeaderFixer.$palceholder.show();
		} else if (atTop && HeaderFixer.$header.hasClass('navbar-fixed-top')) {
			HeaderFixer.$header.removeClass('navbar-fixed-top');
			HeaderFixer.$palceholder.hide();
			if (!HeaderFixer.$headerContent.is(':visible')) {
				HeaderFixer.$headerContent.show('slide');
			}
		}
	},
	'activate' : function() {
		HeaderFixer.$header = $('#header .navbar');
		HeaderFixer.$palceholder = $('#header .nav-placeholder');
		HeaderFixer.headerPos = 5;//HeaderFixer.$header.offset().top;
		HeaderFixer.$headerContent = $('.navbar-inner', HeaderFixer.$header);
		$(window).scroll(HeaderFixer.scrollListener);
		$('.toggle-navbar', HeaderFixer.$header).click(
				HeaderFixer.headerClickHandler);
	},
	'headerClickHandler' : function(event) {
		HeaderFixer.$headerContent.toggle('slide');
	}
}
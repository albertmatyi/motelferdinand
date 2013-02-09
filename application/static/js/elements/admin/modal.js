define(
[
], function(){
	return {
		'init' : function(){
			$('.modal.big-modal').each(function(i, el){
				var $el = $(el);
				var wh = $(window).height();
				var eh = $el.height();
				var marg = -eh / 2 ;
				$el.css('margin-top', marg+'px');
				var hh = $('.modal-header', $el).outerHeight()
				var fh = $('.modal-footer', $el).outerHeight()
				$('.modal-body', $el).height(eh-(hh+fh));
			});
		}
	};
}
);
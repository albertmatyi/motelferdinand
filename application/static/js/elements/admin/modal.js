define(
[
], function(){
	var SAFE_SIDE = 2;
	return {
		'init' : function(){
			$('.modal.big-modal').each(function(i, el){
				var $el = $(el);
				var wh = $(window).height();
				var eh = $el.height();
				var marg = -eh / 2 ;
				$el.css('margin-top', marg+'px');
				var hh = $('> .modal-header', $el).outerHeight(true);
				var fh = $('> .modal-footer', $el).outerHeight(true);
				console.log($el.attr('id') + eh + '-' + hh + '-' + fh  + '='+(eh-(hh+fh)));
				$('> .modal-body', $el).height(eh-(hh+fh)-SAFE_SIDE);
			});
		}
	};
}
);
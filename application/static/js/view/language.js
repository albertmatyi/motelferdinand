/*global define */
/*global $ */
/*global console */
/*global model */

define(
[
	'lib/jquery',
	'lib/transparency',
	'helpers/cookies'
],
function (jq, tr, cookies) {
	"use strict";
	var languageDirective = {
		'name' : {
			'text' : function (params) {
				var lang_id = this.lang_id;
				$(params.element).click(function () {
					cookies.set('lang_id', lang_id);
					if (console && console.log) {
						console.log('setting cookie lang_id=' + lang_id);
					}
					window.location = '/';
				});
				return this.name;
			}
		}
	};

	$('.language.dropdown-menu').render(model.languages, languageDirective);
});
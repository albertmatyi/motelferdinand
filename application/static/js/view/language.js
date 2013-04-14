/*global define */
/*global $ */
/*global window */
/*global model */

define(
[
	'lib/jquery',
	'lib/transparency',
	'helpers/cookies'
],
function (jq, tr, cookies) {
	'use strict';
	var languageDirective = {
		'name' : {
			'text' : function (params) {
				var langId = this.lang_id;
				$(params.element).click(function () {
					cookies.set('lang_id', langId);
					window.location = '/';
				});
				return this.name;
			}
		}
	};

	$('.language.dropdown-menu').render(model.languages, languageDirective);
});
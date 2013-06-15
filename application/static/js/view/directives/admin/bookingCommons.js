/*global define */
/*global $ */

define(['helpers/i18n', 'lib/jquery'], function (i18n) {
	'use strict';
	var STATE_CLASSES = ['none', 'new', 'denied', 'accepted', 'paid'];
	var STATE_ICONS = ['none', 'icon-asterisk', 'icon-ban-circle', 'icon-ok-circle', 'icon-ok-circle'];
	var STATE_TEXT = ['none', i18n.translate('New'), i18n.translate('Denied'), i18n.translate('Accepted'), i18n.translate('Paid')];

	var removeClasses = function (cls, classes) {
		for (var i = classes.length - 1; i >= 0; i--) {
			cls = cls.replace(classes[i], '');
		};
		return cls;
	};

	return {
		'stateClass': function (params) {
			var cls = $(params.element).prop('class') + ' ';
			cls = removeClasses(cls, STATE_CLASSES);
			cls += STATE_CLASSES[this.state];
			return cls;
		},
		'stateIconClass': function (params) {
			var cls = $(params.element).prop('class');
			cls = removeClasses(cls, STATE_ICONS);
			cls += ' ' + STATE_ICONS[this.state];
			return cls;
		},
		'stateText': function () {
			return STATE_TEXT[this.state];
		}
	};
});
/*global define */
/*global model */

define(['helpers/prop', 'lib/jquery'], function (prop) {

	var render = function (type, booking, callback) {
		var user = booking.user;

		loadBody(type, user.language, function (body) {
			body = subst(buildBookingInfo(booking), body);
			loadSubject(type, user.language, function (subject) {
				callback(subject, body);
			});
		});
	};

	var loadBody = function (type, lang, callback) {
		prop.get('mail.' + type + '.' + lang + '.body', callback);
	};

	var loadSubject = function (type, lang, callback) {
		prop.get('mail.' + type + '.' + lang + '.subject', callback);
	};

	var buildBookingInfo = function (booking) {
		var user = booking.user;
		var bookable = model.db.bookable[booking.bookable];
		return {
			'lang_id': user.language,
			'user': user,
			'booking': booking,
			'bookable': bookable,
			'bookable.i18n': bookable.i18n[user.language]
		};
	};

	var subst = function (dict, str, prefix) {
		prefix = prefix || '#';
		for (var key in dict) {
			if (dict.hasOwnProperty(key)) {
				var val = dict[key];
				if (typeof val === 'object') {
					str = subst(val, str, prefix + key + '\\.');
				} else {
					var regex = new RegExp(prefix + key + '\\b', 'g');
					str = str.replace(regex, val);
				}
			}
		}
		return str;
	};

	return {
		'render': render
	};
});
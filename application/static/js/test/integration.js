/*global define */
/*global $ */
/*global console */
/*global window */

define(['lib/jquery',
	'test/category'
	],
	function (jquery, category) {
		"use strict";

		var total = 0;
		var success = 0;
		var fail = 0;

		var runner = {
			'run' : function (test) {
				window.tl = window.tl || function (msg) {
					console.log('\t\t' + msg);
				};

				for (var key in test) {
					if (test.hasOwnProperty(key)) {
						total += 1;
						try {
							console.info('Run ' + key);
							test[key]();
							console.info('\tOK');
							success += 1;
						} catch (e) {
							console.warn('\tFAIL: ' + e);
							fail += 1;
						}
					}
				}
			}
		};
		$('#testButton').click(function () {
			total = 0;
			success = 0;
			fail = 0;
			
			runner.run(category);

			console.info('Test results: ' + success + '/' + total + ' succeeded. ' + fail + ' failed.');
		});
	}
);
'use strict';

define('admin/plugins/random-topics', ['settings', 'alerts'], function (settings, alerts) {
	var ACP = {};

	ACP.init = function () {
		settings.load('random-topics', $('.random-topics-settings'));
		$('#save').on('click', saveSettings);
	};

	function saveSettings() {
		settings.save('random-topics', $('.random-topics-settings'), function () {
			alerts.alert({
				type: 'success',
				title: 'Settings Saved',
				message: 'Please reload your NodeBB to apply these settings',
				clickfn: function () {
					socket.emit('admin.reload');
				},
			});
		});
	}

	return ACP;
});

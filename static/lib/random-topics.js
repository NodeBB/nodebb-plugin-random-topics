'use strict';

define('forum/random-topics', ['topicList'], function (topicList) {
	var	module = {};

	module.init = function () {
		app.enterRoom('random-topics');

		topicList.init('random-topics');
	};

	return module;
});

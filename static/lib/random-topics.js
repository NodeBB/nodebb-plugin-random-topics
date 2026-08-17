'use strict';

define('forum/random-topics', ['topicList'], function (topicList) {
	const module = {};

	module.init = function () {
		app.enterRoom('random-topics');

		topicList.init('random-topics');
	};

	return module;
});

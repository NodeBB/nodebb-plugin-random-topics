'use strict';

const _ = require('lodash');
const nconf = require.main.require('nconf');

const db = require.main.require('./src/database');
const user = require.main.require('./src/user');
const categories = require.main.require('./src/categories');
const privileges = require.main.require('./src/privileges');
const topics = require.main.require('./src/topics');
const meta = require.main.require('./src/meta');
const controllerHelpers = require.main.require('./src/controllers/helpers');

const Controllers = module.exports;

Controllers.renderAdminPage = function (req, res/* , next */) {
	res.render('admin/plugins/random-topics', {});
};

Controllers.render = async function (req, res) {
	const { cid } = req.query;

	const [categoryData, canPost, isPrivileged, settings] = await Promise.all([
		controllerHelpers.getSelectedCategory(cid),
		canPostTopic(req.uid),
		user.isPrivileged(req.uid),
		meta.settings.get('random-topics'),
	]);
	const url = `${settings.route || 'random'}`;
	const data = await getRandomTopics({
		cids: cid,
		uid: req.uid,
	});

	data.canPost = canPost;
	data.showSelect = isPrivileged;
	data.showTopicTools = isPrivileged;
	data.allCategoriesUrl = url + controllerHelpers.buildQueryString(req.query, 'cid', '');
	data.selectedCategory = categoryData.selectedCategory;
	data.selectedCids = categoryData.selectedCids;
	data.title = meta.config.homePageTitle || '[[pages:home]]';

	controllerHelpers.addLinkTags({ url: url, res: req.res, tags: [] });

	if (req.originalUrl.startsWith(`${nconf.get('relative_path')}/api/${url}`) || req.originalUrl.startsWith(`${nconf.get('relative_path')}/${url}`)) {
		const title = url.charAt(0).toUpperCase() + url.slice(1);
		data.title = `[[random-topics:title, ${title}]]`;
		data.breadcrumbs = controllerHelpers.buildBreadcrumbs([{ text: `[[random-topics:title, ${title}]]` }]);
	}

	res.render('random-topics', data);
};

async function getRandomTopics(params) {
	let { cids } = params;
	if (cids) {
		cids = await privileges.categories.filterCids('read', cids, params.uid);
	} else {
		cids = await categories.getCidsByPrivilege('categories:cid', params.uid, 'read');
	}

	const categoryData = await categories.getCategoriesFields(cids, ['topic_count']);
	let tids = [];
	await Promise.all(cids.map(async (cid, index) => {
		if (categoryData[index]) {
			const topicCount = categoryData[index].topic_count;
			const randomStart = Math.floor(Math.random() * topicCount);
			const categoryTids = await db.getSortedSetRevRange(`cid:${cid}:tids:lastposttime`, randomStart, randomStart + 1);
			tids.push(...categoryTids);
		}
	}));

	tids = _.shuffle(tids).slice(0, 20);

	const topicData = await topics.getTopicsByTids(tids, params);
	topics.calculateTopicIndices(topicData, 0);

	return {
		topics: topicData,
		topicCount: tids.length,
	};
}

async function canPostTopic(uid) {
	let cids = await categories.getAllCidsFromSet('categories:cid');
	cids = await privileges.categories.filterCids('topics:create', cids, uid);
	return cids.length > 0;
}

module.exports = Controllers;

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
	const settings = await meta.settings.get('random-topics');
	const oneMonthInMs = 2630000000;
	const cutoff = (parseInt(settings.cutoff || 0, 10) * oneMonthInMs);

	let tids = [];
	// if there are more than 20 cids get 20 random cids
	if (cids.length > 20) {
		cids = _.shuffle(cids).slice(0, 20);
	}
	let counts = [];
	const now = Date.now();
	if (cutoff > 0) {
		counts = await Promise.all(
			cids.map(cid => db.sortedSetCount(`cid:${cid}:tids:lastposttime`, now - cutoff, '+inf'))
		);
	} else {
		const categoryData = await categories.getCategoriesFields(cids, ['topic_count']);
		counts = categoryData.map(c => c.topic_count);
	}

	await Promise.all(cids.map(async (cid, index) => {
		if (counts[index] > 0) {
			const topicCount = counts[index];
			const randomStart = Math.floor(Math.random() * topicCount);
			let categoryTids = [];
			if (cutoff) {
				categoryTids = await db.getSortedSetRevRangeByScore(
					`cid:${cid}:tids:lastposttime`, randomStart, randomStart + (21 - cids.length), '+inf', now - cutoff
				);
			} else {
				categoryTids = await db.getSortedSetRevRange(
					`cid:${cid}:tids:lastposttime`, randomStart, randomStart + (21 - cids.length)
				);
			}
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


'use strict';

const meta = require.main.require('./src/meta');
const controllers = require('./lib/controllers');

const plugin = module.exports;

plugin.init = async (params) => {
	const { router, /* , controllers */ } = params;
	const routeHelpers = require.main.require('./src/routes/helpers');

	const settings = await meta.settings.get('random-topics');
	const route = `/${settings.route || 'random'}`;
	routeHelpers.setupPageRoute(router, route, controllers.render);

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/random-topics', controllers.renderAdminPage);
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/random-topics',
		icon: 'fa-book',
		name: 'Random Topics',
	});

	return header;
};

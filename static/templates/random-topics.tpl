{{{ if widgets.header.length }}}
<div data-widget-area="header">
	{{{each widgets.header}}}
	{{widgets.header.html}}
	{{{end}}}
</div>
{{{ end }}}

<div class="row">
	<div class="random-topics {{{if widgets.sidebar.length }}}col-lg-9 col-sm-12{{{ else }}}col-lg-12{{{ end }}}">
		<div class="{{{ if config.theme.stickyToolbar }}}sticky-tools{{{ end }}} mb-3">
			<nav class="topic-list-header d-flex flex-nowrap my-2 p-0 border-0 rounded">
				<div class="d-flex flex-row p-2 text-bg-light gap-1 border rounded w-100 align-items-center">
					<div component="category/controls" class="d-flex me-auto mb-0 gap-2 flex-wrap">
						<!-- IMPORT partials/category/filter-dropdown-left.tpl -->
						<!-- IMPORT partials/category/tools.tpl -->
					</div>

					<div class="d-flex gap-1 align-items-center">
						{{{ if canPost }}}
						<!-- IMPORT partials/buttons/newTopic.tpl -->
						{{{ end }}}

						<!-- only show login button if not logged in and doesn't have any posting privilege -->
						{{{ if (!loggedIn && (!privileges.topics:create && !canPost))}}}
						<a component="category/post/guest" href="{config.relative_path}/login" class="btn btn-sm btn-primary">[[category:guest-login-post]]</a>
						{{{ end }}}
					</div>
				</div>
			</nav>
		</div>

		<div class="category">
			{{{ if !topics.length }}}
			<div class="alert alert-info" id="category-no-topics">[[recent:no-recent-topics]]</div>
			{{{ end }}}

			<!-- IMPORT partials/topics_list.tpl -->

			{{{ if config.usePagination }}}
			<!-- IMPORT partials/paginator.tpl -->
			{{{ end }}}
		</div>
	</div>

	<div data-widget-area="sidebar" class="col-lg-3 col-sm-12 {{{ if !widgets.sidebar.length }}}hidden{{{ end }}}">
		{{{ each widgets.sidebar }}}
		{{widgets.sidebar.html}}
		{{{ end }}}
	</div>
</div>

<div data-widget-area="footer">
	{{{each widgets.footer}}}
	{{widgets.footer.html}}
	{{{end}}}
</div>
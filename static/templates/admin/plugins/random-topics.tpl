<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 col-md-8 px-0 mb-4" tabindex="0">
			<form role="form" class="random-topics-settings">
				<div class="mb-3">
					<label class=form-label" for="route">Route to show topics at eq: "featured" or "random-topics". No leading slash.</label>
					<input type="text" id="route" name="route" title="Route" class="form-control" placeholder="random">
				</div>

				<div class="mb-3">
					<label class="form-label" for="cutoff">Time cutoff in months, older topics won't be shown. Set to 0 to disable.</label>
					<input type="text" id="cutoff" name="cutoff" title="cutoff" class="form-control" placeholder="0">
				</div>
			</form>
		</div>

		<!-- IMPORT admin/partials/settings/toc.tpl -->
	</div>
</div>

<form role="form" class="random-topics-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">General</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<label for="route">Route to show topics at eq: "featured" or "random-topics". No leading slash.</label>
				<input type="text" id="route" name="route" title="Route" class="form-control" placeholder="random">
			</div>
			<div class="form-group">
				<label for="cutoff">Time cutoff in months, older topics won't be shown. Set to 0 to disable.</label>
				<input type="text" id="cutoff" name="cutoff" title="cutoff" class="form-control" placeholder="0">
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>

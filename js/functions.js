function load_html_modules(url) {
	$.get(url, function (result) {
		var html = $(result);
		$("[slot]").each(function () {
			var id = $(this).attr('slot');
			$(this).html(html.find('#' + id).html());
		});
	});
}

function now_dir() {
}

window.addEventListener('DOMContentLoaded', () => {
	load_html_modules(now_dir() + "templates.html");
});

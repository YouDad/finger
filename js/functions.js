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
	let js = document.scripts;
	let url = js[js.length - 1].baseURI;
	return url.substring(0, url.lastIndexOf("/") + 1);
}

window.addEventListener('DOMContentLoaded', () => {
	load_html_modules(now_dir() + "templates.html");
});

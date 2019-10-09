// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.fs = require('fs');
window.os = require('os');
window.path_join = require('path').join;
window.__project = __dirname;
window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);
		if (element)
			element.innerText = text;
	}

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type]);
	}

	window.serial = require("serialport");
	window.$ = require("jquery");
	window.jQuery = window.$;
	require("bootstrap");
	window.Vue = require("vue/dist/vue.js");
});

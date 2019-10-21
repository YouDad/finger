// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.fs = require('fs');
window.os = require('os');
window.moment = require('moment');
window.path_join = require('path').join;
window.__project = __dirname;
window.serial_port = require("serialport");
window.Vue = require("vue/dist/vue.js");
window.$bus = new Vue();
window.$canvas = require('canvas');
window.addEventListener('DOMContentLoaded', () => {
	window.$ = require("jquery");
	window.jQuery = window.$;
	require("bootstrap");
});
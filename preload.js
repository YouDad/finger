// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.fs = require('fs');
window.os = require('os');
window.moment = require('moment');
window.path_join = require('path').join;
window.exec = require('child_process').exec;
window.__project = __dirname;
window.save_image = false;
window.serial_port = require("serialport");
window.Vue = require("vue/dist/vue.js");
window.$bus = new Vue();
window.$canvas = require('canvas');
window.$Buffer = Buffer;
window.addEventListener('DOMContentLoaded', () => {
	window.$ = require("jquery");
	window.jQuery = window.$;
	require("bootstrap");
});

window.config = {
    bmp: true,
    png: false,
};

window.$wait = function(names, func) {
    let interval_id = setInterval(function () {
        if (names instanceof Array) {
            let ret = false;
            for (name of names) {
                eval(`if(${name} === undefined) ret = true;`);
                if (ret) {
                    return;
                }
            }
            clearInterval(interval_id);
            func && func.call();
        } else {
            $log("$wait names is not Array", "danger");
        }
    }, 100);
}

window.generate_dependency = function(node, dependencies) {
    if (node !== undefined) {
        let childs = node.children();
        if (childs.length > 0) {
            for (let i = 0; i < childs.length; i++) {
                generate_dependency($(childs[i]), dependencies);
            }
        } else {
            let nodename = node[0].nodeName.toLowerCase();
            let prefix = nodename.slice(0, nodename.indexOf('_'));
            for (let this_prefix of ['gd32', 'syno', 'luwh']) {
                if (prefix === this_prefix) {
                    dependencies.push(`window.Vue.options["components"]["${nodename}"]`);
                    break;
                }
            }
        }
    }
}

window.$loadjs = function(path) {
    dfs(path_join(__project, path));
    function dfs(path) {
        if (fs.lstatSync(path).isDirectory()) {
            let file = fs.readdirSync(path);
            file.forEach(function (item, index) {
                dfs(path_join(path, item));
            });
        } else {
            let script = document.createElement('script');
            script.type = "text/javascript";
            script.src = path;
            document.body.appendChild(script);
            console.log(`add script<${path}>`);
        }
    }
}

window.icc_define_icc = function(name, callback) {
    $bus.$on(name, callback);
}


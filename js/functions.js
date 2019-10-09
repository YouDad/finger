function $wait(component_name, func) {
    interval_id = setInterval(function () {
        if (window.Vue.options["components"][component_name] !== undefined) {
            clearInterval(interval_id);
            func && func.call();
        }
    }, 100);
}

function $loadjs(path) {
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

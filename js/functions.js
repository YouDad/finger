function $wait(names, func) {
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

function generate_dependency(node, dependencies) {
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

function range(start, end) {
    if (end === undefined) {
        end = start;
        start = 0;
    }
    let ret = [];
    for (let i = start; i < end; i++) {
        ret.push(i);
    }
    return ret;
}

function icc_define_icc(name, callback) {
    $bus.$on(name, callback);
}

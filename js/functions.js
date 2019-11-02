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

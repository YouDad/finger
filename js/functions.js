function $nowdir() {
    let js = document.scripts;
    let url = js[js.length - 1].baseURI;
    return url.substring(0, url.lastIndexOf("/") + 1);
}

function $wait(component_name, func) {
    interval_id = setInterval(function() {
        if(window.Vue.options["components"][component_name] !== undefined){
            clearInterval(interval_id);
            func && func.call();
        }
    }, 100);
}

function $loadjs(path) {
    let filepath = ($nowdir() + path).replace("file://", "");
    dfs(filepath);

    function dfs(path) {
        console.log(path);
        let file;

        if(fs.lstatSync(path).isDirectory()) {
            file = fs.readdirSync(path);
            file.forEach(function (item, index) {
                dfs(path + item);
            });
        } else {
            let script=document.createElement('script');
            script.type="text/javascript";
            script.src=path;
            document.body.appendChild(script);
            console.log("add script"+path);
        }
    }
}

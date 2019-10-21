{
    let procedures = {
        "begin": async function () {
            let data_package = (await $syno.request($syno.Empty))[0];
            $port.write(data_package);
            $procedure.next("process_retval");
        },
        "process_retval": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $user_log("清空模板库：" + $syno.explain(result.retval),
                result.retval ? "error" : "info");
            $procedure.kill();
            $procedure.load('$syno.validchar').exec();
        },
    };

    $procedure.define("$syno.emptychar", procedures);
}
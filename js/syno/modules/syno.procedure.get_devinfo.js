{
    let procedures = {
        "begin": async function () {
            let data_package = (await $syno.request($syno.ReadINFPage))[0];
            $port.write(data_package);
            $procedure.next("parse_data");
        },
        "parse_data": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $log(result);
            $user_log(`获得设备信息：${$syno.explain(result.retval)}`, "success");
            icc_set_devinfo(result);
            $procedure.kill();
        },
    };

    $procedure.define("$syno.get_devinfo", procedures);
}

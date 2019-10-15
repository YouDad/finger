{
    let procedures = {
        "begin": async function () {
            let data_package = (await $syno.request($syno.GetRandomCode))[0];
            $port.write(data_package);
            $procedure.next("parse_data");
        },
        "parse_data": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $user_log("随机数结果：" + result.data.toString());
            $procedure.kill();
        },
    };

    $procedure.define("$syno.get_random", procedures);
}

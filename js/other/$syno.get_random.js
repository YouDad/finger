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
            if (result.retval == 0x00) {
                $user_log(`随机数结果：${result.data.toString()}`);
            } else {
                $user_log(`随机数结果：${$syno.explain(result.retval)}`, "danger");
            }
            $procedure.kill();
        },
    };

    $procedure.define("$syno.get_random", procedures);
}

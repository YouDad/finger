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
                let number = 0;
                number = number * 256 + result.data[0];
                number = number * 256 + result.data[1];
                number = number * 256 + result.data[2];
                number = number * 256 + result.data[3];
                number = number.toString(16);
                while(number.length < 8) {
                    number = "0" + number;
                }
                number = number.toUpperCase();
                number = "0x" + number;
                $user_log(`随机数结果：${result.data.toString()} , 十六进制为${number}`);
            } else {
                $user_log(`随机数结果：${$syno.explain(result.retval)}`, "danger");
            }
            $procedure.kill();
        },
    };

    $procedure.define("$syno.get_random", procedures);
}

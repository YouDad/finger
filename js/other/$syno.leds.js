{
    let procedures = {
        "begin": async function (leds) {
            let data = leds[0] * 1 + leds[1] * 2 + leds[2] * 4 + leds[3] * 8;
            let data_package = (await $syno.request($syno.ControlLED, [data]))[0];
            $port.write(data_package);
            $procedure.next("process_retval");
        },
        "process_retval": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $user_log("控制LED灯结果：" + $syno.explain(result.retval));
            $procedure.kill();
        },
    };

    $procedure.define("$syno.leds", procedures);
}

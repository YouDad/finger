{
    let procedures = {
        data: 0,
        "clean": async function () {
            this.data = 0;
        },
        "begin": async function (leds) {
            this.data = 15 - (leds[0] * 1 + leds[1] * 2 + leds[2] * 4 + leds[3] * 8);
            let data_package = (await $syno.request($syno.ControlLED, [this.data]))[0];
            $port.write(data_package);
            $procedure.next("process_retval");
        },
        "process_retval": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            let str = this.data.toString(2);
            while (str.length < 4) {
                str = "0" + str;
            }
            $user_log(`控制LED灯(${str})结果：` + $syno.explain(result.retval),
                result.retval ? "danger" : "success");
            if (result.retval != 0) {
                icc_leds_back();
            }
            $procedure.kill();
        },
    };

    $procedure.define("$syno.leds", procedures);
}

{
    let procedures = {
        "begin": async function () {
            let data_package = (await $gd32.request($gd32.DeviceInfo))[0];
            $port.write(data_package);
            $procedure.next("parse_data");
        },
        "parse_data": function (data) {
            let result = $gd32.parse(data);
            icc_set_devinfo(result);
            $procedure.kill();
        },
    };

    $procedure.define("$gd32.get_devinfo", procedures);
}

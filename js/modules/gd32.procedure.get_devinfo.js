{
    let procedures = {
        "begin": async function () {
            let data_package = (await $syno.request($syno.DeviceInfo))[0];
            $port.write(data_package);
            $procedure.next("parse_data");
        },
        "parse_data": function (data) {
            let result = $syno.parse(data);
            icc_set_devinfo(result);
            $procedure.kill();
        },
    };

    $procedure.define("$gd32.get_devinfo", procedures);
}

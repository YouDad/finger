{
    let procedures = {
        "begin": async function (address) {
            let data_package = (await $gd32.request($gd32.ReadRegister, address))[0];
            $port.write(data_package);
            $procedure.next("get_result");
        },
        "get_result": function (data) {
            let result = $gd32.parse(data);
            $user_log(`读取寄存器成功`, "success");
            icc_set_value(result.data[0]);
            $procedure.kill();
        },
    };

    $procedure.define("$gd32.read_register", procedures);
}

{
    let procedures = {
        "begin": async function (data) {
            let data_package = (await $gd32.request($gd32.WriteRegister, data))[0];
            $port.write(data_package);
            $user_log(`写入寄存器成功`, "success");
            $procedure.kill();
        },
    };

    $procedure.define("$gd32.write_register", procedures);
}

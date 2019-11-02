{
    let procedures = {
        "begin": async function (address, value) {
            let data_package = (await $gd32.request($gd32.ReadRegister, [address, value]))[0];
            $port.write(data_package);
            $user_log(`写入寄存器成功`, "success");
            $procedure.kill();
        },
    };

    $procedure.define("$gd32.write_register", procedures);
}

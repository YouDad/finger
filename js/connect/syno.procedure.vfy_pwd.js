{
    let procedures = {
        interval_id: null,
        "begin": async function () {
            password = await icc_get_password();

            let datas = [];
            datas.push(parseInt(password.slice(0, 2), 16));
            datas.push(parseInt(password.slice(2, 4), 16));
            datas.push(parseInt(password.slice(4, 6), 16));
            datas.push(parseInt(password.slice(6, 8), 16));

            let data_package = (await $syno.request($syno.VfyPwd, datas))[0];
            $port.write(data_package);
            $procedure.next("process_vfy_pwd");

            this.interval_id = setInterval(() => {
                clearInterval(this.interval_id);
                $procedure.exec();
            }, 1000);
        },
        "process_vfy_pwd": function (data) {
            if (data === undefined) {
                clearInterval(this.interval_id);
                $user_log("验证密码超时", "danger");
            } else {
                let result = $syno.parse(data);
                $log($syno.explain(result.retval));
                let message = "验证密码：" + $syno.explain(result.retval);
                $user_log(message, result.retval ? "danger" : "success");
                if (!result.retval) {
                    $procedure.add("$syno.get_devinfo");
                    $procedure.add('$syno.validchar');
                }
            }
            $procedure.kill();
        },
    };

    $procedure.define("$syno.vfy_pwd", procedures);
}

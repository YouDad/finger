{
    let procedures = {
        interval_id: null,
        "begin": async function () {
            let password = {};
            await $bus.$emit("get_password", password);
            password = password.password;

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
                let message = "验证密码超时";
                $user_log(message);
                $bus.$emit("notify.danger", message);
            } else {
                let result = $syno.parse(data);
                $log($syno.explain(result.retval));
                let message = "验证密码：" + $syno.explain(result.retval);
                if (result.retval) {
                    $user_log(message);
                    $bus.$emit("notify.danger", message);
                } else {
                    $bus.$emit("notify.success", message);
                    $procedure.add("$syno.get_devinfo");
                    $procedure.add('$syno.validchar');
                }
            }
            $procedure.kill();
        },
    };

    $procedure.define("$syno.vfy_pwd", procedures);
}

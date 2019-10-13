{
    let procedures = {
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
        },
        "process_vfy_pwd": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            // TODO: 处理接收到密码的事件
            $procedure.kill();
            $procedure.load("$syno.get_devinfo").exec();
        },
    };

    $procedure.define("$syno.vfy_pwd", procedures);
}

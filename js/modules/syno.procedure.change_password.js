{
    let procedures = {
        data: "",
        "begin": async function (data) {
            this.data = data;
            let passwd = data.use;
            if (passwd.length != 8) {
                $user_log("密码必须为8位十六进制数", "danger");
                return;
            } else {
                for (let i = 0; i < 8; i++) {
                    if (passwd[i] < '0' || 'f' < passwd[i] ||
                        '9' < passwd[i] && passwd[i] < 'A' ||
                        'F' < passwd[i] && passwd[i] < 'a') {
                        $user_log("密码必须为8位十六进制数", "danger");
                        return;
                    }
                }
            }
            let datas = [0, 0, 0, 0];
            datas[0] = parseInt(passwd.slice(0, 2), 16);
            datas[1] = parseInt(passwd.slice(2, 4), 16);
            datas[2] = parseInt(passwd.slice(4, 6), 16);
            datas[3] = parseInt(passwd.slice(6, 8), 16);

            let data_package = (await $syno.request($syno.SetPwd, datas))[0];
            $port.write(data_package);
            $procedure.next("process_retval");
        },
        "process_retval": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $user_log(`修改密码(${this.data.see})：${$syno.explain(result.retval)}`,
                result.retval ? "danger" : "info");
            $procedure.add("$syno.get_devinfo");
            $procedure.kill();
        },
    };

    $procedure.define("$syno.change_password", procedures);
}

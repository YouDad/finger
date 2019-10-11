{
    let procedures = {
        "begin": async function (port) {
            let password = {};
            await $bus.$emit("get_password", password);
            password = password.password;

            let datas = [];
            datas.push(parseInt(password.slice(0, 2), 16));
            datas.push(parseInt(password.slice(2, 4), 16));
            datas.push(parseInt(password.slice(4, 6), 16));
            datas.push(parseInt(password.slice(6, 8), 16));

            let data_package = (await $syno.request($syno.VfyPwd, datas))[0];
            port.write(Uint8Array.from(data_package), "binary");
            $procedure.next("process_vfy_pwd");
        },
        "process_vfy_pwd": function (data) {
            let result = $syno.parse(data);
            console.log($syno.explain(result.retval));
        },
    };

    $procedure.define("syno.vfy_pwd", procedures);
}

{
    let procedures = {
        data: "",
        "begin": async function (data) {
            this.data = data;
            let addr = data.use;
            if (addr.length != 8) {
                $user_log("地址必须为8位十六进制数", "danger");
                return;
            } else {
                for (let i = 0; i < 8; i++) {
                    if (addr[i] < '0' || 'f' < addr[i] ||
                        '9' < addr[i] && addr[i] < 'A' ||
                        'F' < addr[i] && addr[i] < 'a') {
                        $user_log("地址必须为8位十六进制数", "danger");
                        return;
                    }
                }
            }
            let datas = [0, 0, 0, 0];
            datas[0] = parseInt(addr.slice(0, 2), 16);
            datas[1] = parseInt(addr.slice(2, 4), 16);
            datas[2] = parseInt(addr.slice(4, 6), 16);
            datas[3] = parseInt(addr.slice(6, 8), 16);

            let data_package = (await $syno.request($syno.SetChipAddr, datas))[0];
            $port.write(data_package);
            $procedure.next("process_retval");
        },
        "process_retval": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $user_log(`修改地址(${this.data.see})：${$syno.explain(result.retval)}`, result.retval ? "danger" : "info");
            if (!result.retval) {
                await $bus.$emit("set_address", { address: this.data.use });
            }
            $procedure.add("$syno.get_devinfo");
            $procedure.kill();
        },
    };

    $procedure.define("$syno.change_address", procedures);
}

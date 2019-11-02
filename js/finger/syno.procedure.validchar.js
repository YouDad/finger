{
    let procedures = {
        dbsize: 0,
        next: 0,
        "begin": async function () {
            this.dbsize = await icc_get_dbsize();
            this.next = 0;
            $procedure.next("request").exec();
        },
        "request": async function () {
            if (this.next * 256 >= this.dbsize) {
                $procedure.kill();
                return;
            }
            let data_package = (await $syno.request($syno.ReadIndexTable, [this.next]))[0];
            this.next++;
            $port.write(data_package);
            $procedure.next("process_table");
        },
        "process_table": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval) {
                $user_log(`获取有效模板列表：` + $syno.explain(result.retval),
                    result.retval ? "danger" : "info");
            } else {
                list = [];
                for (let i = 0; i < 32; i++) {
                    for (let j = 0; j < 8; j++) {
                        if (result.data[i] & (1 << j)) {
                            list.push(i * 8 + j);
                        }
                    }
                }
                if (list.length == 0) {
                    $user_log("获取有效模板列表为空", "success");
                } else {
                    $user_log("获取有效模板列表：" + list.join(","), "success");
                }

                bool_list = [];
                for (const i in window.range(this.dbsize)) {
                    if (list.length && list[0] == i) {
                        list.shift();
                        bool_list.push(1);
                    } else {
                        bool_list.push(0);
                    }
                }
                icc_set_finger_map(bool_list);
            }
            $procedure.next("request").exec();
        },
    };

    $procedure.define("$syno.validchar", procedures);
}

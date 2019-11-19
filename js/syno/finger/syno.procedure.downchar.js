{
    let procedures = {
        finger_id: 0,
        "clean": async function () {
            this.finger_id = 0;
        },
        "begin": async function (charBuffer) {
            this.finger_id = await icc_get_finger_id();
            let data_packages = await $syno.request($syno.DownChar, [1], charBuffer);
            for (data_package of data_packages) {
                $port.write(data_package);
            }
            $procedure.next("process_loadchar");
        },
        "process_loadchar": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                let datas = [1, this.finger_id / 256, this.finger_id % 256];

                let data_package = (await $syno.request($syno.StoreChar, datas))[0];
                $port.write(data_package);
                $procedure.next("process_upchar");
            } else {
                $procedure.next("end").exec("下载特征失败");
            }
        },
        "process_upchar": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                result.finger_id = this.finger_id;
                $procedure.next("end").exec();
            } else {
                $procedure.next("end").exec("存储特征失败");
            }
        },
        "end": function (message) {
            if (message) {
                $user_log(message, "danger");
            } else {
                $user_log("下载特征成功", "success");
                $procedure.add("$syno.validchar");
            }
            $procedure.kill();
        },
    };

    $procedure.define("$syno.downchar", procedures);
}

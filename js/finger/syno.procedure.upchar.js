{
    let procedures = {
        finger_id: 0,
        "begin": async function (message) {
            let finger_id = {};
            await $bus.$emit("get_finger_id", finger_id);
            this.finger_id = finger_id.finger_id;

            let datas = [2, this.finger_id / 256, this.finger_id % 256];

            let data_package = (await $syno.request($syno.LoadChar, datas))[0];
            $port.write(data_package);
            $procedure.next("process_loadchar");
            if (message) {
                $user_log(message, "warning");
            }
        },
        "process_loadchar": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                let data_package = (await $syno.request($syno.UpChar, [2]))[0];
                $port.write(data_package);
                $procedure.next("process_upchar");
            } else {
                $procedure.next("end").exec("载入特征失败");
            }
        },
        "process_upchar": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                result.finger_id = this.finger_id;
                $bus.$emit("save_char", result);
                $procedure.next("end").exec();
            } else {
                $procedure.next("end").exec("上传特征失败");
            }
        },
        "end": function (message) {
            if (message) {
                $user_log(message, "danger");
            }
            $procedure.kill();
        },
    };

    $procedure.define("$syno.upchar", procedures);
}

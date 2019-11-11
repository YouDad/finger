{
    let procedures = {
        continued: false,
        "clean": async function () {
            this.continued = false;
        },
        "begin": async function (message) {
            if (message === true) {
                this.continued = true;
            }
            finger_id = await icc_get_finger_id();

            let datas = [2, finger_id / 256, finger_id % 256];

            let data_package = (await $syno.request($syno.LoadChar, datas))[0];
            $port.write(data_package);
            $procedure.next("get_image");
            if (typeof (message) !== "boolean") {
                $user_log(message, "warning");
            }
        },
        "get_image": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                let data_package = (await $syno.request($syno.GetImage))[0];
                $port.write(data_package);
                $procedure.next("up_image");
            } else {
                $procedure.next("end").exec("载入特征失败");
            }
        },
        "up_image": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                if (await icc_is_save_image()) {
                    let data_package = (await $syno.request($syno.UpImage))[0];
                    $port.write(data_package);
                    $procedure.next("show_image");
                } else {
                    let data_package = (await $syno.request($syno.GenChar, [0x01]))[0];
                    $port.write(data_package);
                    $procedure.next("match");
                }
            } else {
                let data_package = (await $syno.request($syno.GetImage))[0];
                $port.write(data_package);
                $procedure.next("up_image");
                if (result.retval === 0x02) {
                    $user_log("请按手指", "warning");
                } else {
                    $user_log($syno.explain(result.retval), "warning");
                }
            }
        },
        "show_image": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                icc_show_image(result);

                let data_package = (await $syno.request($syno.GenChar, [0x01]))[0];
                $port.write(data_package);
                $procedure.next("match");
            } else {
                $procedure.next("end").exec("上传图像失败");
            }
        },
        "match": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                let data_package = (await $syno.request($syno.Match))[0];
                $port.write(data_package);
                $procedure.next("process_match");
            } else {
                //生成特征失败
                $procedure.next("begin").exec("生成特征失败");
            }
        },
        "process_match": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                $user_log(`分数：${result.data[0] * 256 + result.data[1]}`);
                $procedure.next("end").exec();
            } else {
                //匹配失败
                $procedure.next("end").exec("比对失败");
            }
        },
        "end": function (message) {
            this.buffer_id = 1;
            if (message) {
                $user_log(message, "danger");
            } else {
                $user_log("比对：成功", "success");
            }
            if (this.continued) {
                $procedure.next("begin").exec();
            } else {
                $procedure.kill();
            }
        },
    };

    $procedure.define("$syno.match", procedures);
}

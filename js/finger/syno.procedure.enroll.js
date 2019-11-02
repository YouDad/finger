{
    let procedures = {
        buffer_id: 1,
        "begin": async function (message) {
            let data_package = (await $syno.request($syno.GetEnrollImage))[0];
            $port.write(data_package);
            $procedure.next("process_enroll_image");
            if (message) {
                $user_log(message, "warning");
            }
        },
        "process_enroll_image": async function (data) {
            let result = $syno.parse(data);
            $log("GetEnrollImages" + $syno.explain(result.retval));
            if (result.retval == 0x00) {
                let data_package = (await $syno.request($syno.UpImage))[0];
                $port.write(data_package);
                $procedure.next("show_image");
            } else {
                $procedure.next("begin").exec($syno.explain(result.retval));
                return;
            }
        },
        "show_image": async function (data) {
            let result = $syno.parse(data);
            $log("UpImage" + $syno.explain(result.retval));
            if (result.retval == 0x00) {
                $icc_show_image(result);

                let data_package = (await $syno.request($syno.GenChar, [this.buffer_id]))[0];
                $port.write(data_package);
                $procedure.next("search");
            } else {
                $procedure.next("end").exec("上传图片失败");
                return;
            }
        },
        "search": async function (data) {
            let result = $syno.parse(data);
            $log("GenChar" + $syno.explain(result.retval));
            if (result.retval == 0x00) {
                dbsize = await icc_get_dbsize();

                let datas = [this.buffer_id, 0, 0, dbsize / 256, dbsize % 256];

                let data_package = (await $syno.request($syno.Search, datas))[0];
                $port.write(data_package);
                $procedure.next("process_search");
            } else {
                $procedure.next("begin").exec("生成特征失败");
                return;
            }
        },
        "process_search": async function (data) {
            let result = $syno.parse(data);
            $log("Search" + $syno.explain(result.retval));
            if (result.retval == 0x09 || result.retval == 0x17) {
                let data_package = (await $syno.request($syno.GetEnrollImage))[0];
                $port.write(data_package);
                $procedure.next("wait_for_move_finger");
            } else {
                //搜到指纹
                $procedure.next("end").exec("搜到指纹");
                return;
            }
        },
        "wait_for_move_finger": async function (data) {
            let result = $syno.parse(data);
            $log("GetEnrollImage" + $syno.explain(result.retval));
            if (result.retval == 0x02) {
                //没指纹
                if (this.buffer_id >= 3) {
                    let data_package = (await $syno.request($syno.RegModel))[0];
                    $port.write(data_package);
                    $procedure.next("process_register_model");
                } else {
                    this.buffer_id++;
                    $procedure.next("begin").exec();
                    return;
                }
            } else {
                //有指纹
                let data_package = (await $syno.request($syno.GetEnrollImage))[0];
                $port.write(data_package);
                $procedure.next("wait_for_move_finger");
            }
        },
        "process_register_model": async function (data) {
            let result = $syno.parse(data);
            $log("RegModel" + $syno.explain(result.retval));
            if (result.retval == 0x00) {
                finger_id = await icc_get_finger_id();

                let datas = [1, finger_id / 256, finger_id % 256];

                let data_package = (await $syno.request($syno.StoreChar, datas))[0];
                $port.write(data_package);
                $procedure.next("process_store_char");
            } else {
                $procedure.next("end").exec("合并失败");
                return;
            }
        },
        "process_store_char": function (data) {
            let result = $syno.parse(data);
            $log("StoreChar" + $syno.explain(result.retval));
            if (result.retval == 0x00) {
                $procedure.next("end").exec();
            } else {
                $procedure.next("end").exec("存储失败");
                return;
            }
        },
        "end": function (message) {
            this.buffer_id = 1;
            if (message) {
                $user_log(message, "danger");
            } else {
                $user_log("注册成功", "success");
            }

            $procedure.add("$syno.validchar");
            $procedure.kill();
        }
    };

    $procedure.define("$syno.enroll", procedures);
}
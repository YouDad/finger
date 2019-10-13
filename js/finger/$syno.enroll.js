{
    let procedures = {
        buffer_id: 1,
        "begin": async function (message) {
            let data_package = (await $syno.request($syno.GetEnrollImage))[0];
            $port.write(data_package);
            $procedure.next("process_enroll_image");
            if (message) {
                console.log(message);
            }
        },
        "process_enroll_image": async function (data) {
            let result = $syno.parse(data);
            console.log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                let data_package = (await $syno.request($syno.UpImage))[0];
                $port.write(data_package);
                $procedure.next("show_image");
            } else {
                $procedure.next("begin").exec();
            }
        },
        "show_image": async function (data) {
            let result = $syno.parse(data);
            console.log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                $bus.$emit("show_image", result);

                let data_package = (await $syno.request($syno.GenChar, [this.buffer_id]))[0];
                $port.write(data_package);
                $procedure.next("search");
            } else {
                $procedure.next("end").exec("上传图片失败");
            }
        },
        "search": async function (data) {
            let result = $syno.parse(data);
            console.log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                let dbsize = {};
                await $bus.$emit("get_dbsize", dbsize);
                dbsize = dbsize.dbsize;

                let datas = [this.buffer_id, 0, 0, dbsize / 256, dbsize % 256];

                let data_package = (await $syno.request($syno.Search, datas))[0];
                $port.write(data_package);
                $procedure.next("process_search");
            } else {
                //生成特征失败
                $procedure.next("begin").exec("生成特征失败");
            }
        },
        "process_search": async function (data) {
            let result = $syno.parse(data);
            console.log($syno.explain(result.retval));
            if (result.retval == 0x09 || result.retval == 0x17) {
                let data_package = (await $syno.request($syno.GetEnrollImage))[0];
                $port.write(data_package);
                $procedure.next("wait_for_move_finger");
            } else {
                //搜到指纹
                $procedure.next("end").exec("搜到指纹");
            }
        },
        "wait_for_move_finger": async function (data) {
            let result = $syno.parse(data);
            console.log($syno.explain(result.retval));
            if (result.retval == 0x02) {
                //没指纹
                if (this.buffer_id >= 3) {
                    let data_package = (await $syno.request($syno.RegModel))[0];
                    $port.write(data_package);
                    $procedure.next("process_register_model");
                } else {
                    this.buffer_id++;
                    $procedure.next("begin").exec();
                }
            } else {
                //有指纹
                $procedure.next("process_search").exec({ retval: 0x09 });
            }
        },
        "process_register_model": async function (data) {
            let result = $syno.parse(data);
            console.log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                let finger_id = {};
                await $bus.$emit("get_finger_id", finger_id);
                finger_id = finger_id.finger_id;

                let datas = [1, finger_id / 256, finger_id % 256];

                let data_package = (await $syno.request($syno.StoreChar, datas))[0];
                $port.write(data_package);
                $procedure.next("process_store_char");
            } else {
                //合并失败
                $procedure.next("end").exec("合并失败");
            }
        },
        "process_store_char": function (data) {
            let result = $syno.parse(data);
            console.log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                $procedure.next("end").exec();
            } else {
                //存储失败
                $procedure.next("end").exec("存储失败");
            }
        },
        "end": function (message) {
            this.buffer_id = 1;
            if (message)
                console.log(message);
            else
                console.log("success");
            $procedure.kill();
        }
    };

    $procedure.define("$syno.enroll", procedures);
}
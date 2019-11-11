{
    let procedures = {
        continued: false,
        buffer_id: 1,
        "clean": async function () {
            this.continued = false;
            this.buffer_id = 1;
        },
        "begin": async function (message) {
            if (message === true) {
                this.continued = true;
            }
            let data_package = (await $syno.request($syno.GetImage))[0];
            $port.write(data_package);
            $procedure.next("up_image");
            if (typeof (message) !== "boolean") {
                $user_log(message, "warning");
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
                    $procedure.next("search");
                }
            } else {
                if (result.retval === 0x02) {
                    $procedure.next("begin").exec("请按手指");
                } else {
                    $procedure.next("begin").exec($syno.explain(result.retval));
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
                $procedure.next("search");
            } else {
                $procedure.next("end").exec("上传图像失败");
            }
        },
        "search": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                dbsize = await icc_get_dbsize();

                let datas = [0x01, 0, 0, Math.floor(dbsize / 256), dbsize % 256];

                let data_package = (await $syno.request($syno.Search, datas))[0];
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
                $user_log(`该手指和第${(result.data[0] * 256 + result.data[1])}个的得分是: ${(result.data[2] * 256 + result.data[3])}`, "success");
                $procedure.next("end").exec();
            } else {
                //匹配失败
                $procedure.next("end").exec("搜索失败");
            }
        },
        "end": function (message) {
            if (message) {
                $user_log(message, "danger");
            } else {
                $user_log("搜索成功", "success");
            }

            if (this.continued) {
                $procedure.next("begin").exec();
            } else {
                $procedure.kill();
            }
        },
    };

    $procedure.define("$syno.search", procedures);
}

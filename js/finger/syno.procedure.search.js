{
    let procedures = {
        continued: false,
        "begin": async function (message) {
            if (message === true) {
                this.continued = true;
            }
            let data_package = (await $syno.request($syno.GetImage))[0];
            $port.write(data_package);
            $procedure.next("up_image");
            if (message) {
                $user_log(message, "warning");
            }
        },
        "up_image": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                let data_package = (await $syno.request($syno.UpImage))[0];
                $port.write(data_package);
                $procedure.next("show_image");
            } else {
                $procedure.next("begin").exec($syno.explain(result.retval));
            }
        },
        "show_image": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                $bus.$emit("show_image", result);

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
                let dbsize = {};
                await $bus.$emit("get_dbsize", dbsize);
                dbsize = dbsize.dbsize;

                let datas = [0x01, 0, 0, dbsize / 256, dbsize % 256];

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
                $log(`第${(result.data[0] * 256 + result.data[1])}个`);
                $log(`分数: ${(result.data[2] * 256 + result.data[3])}`);
                $procedure.next("end").exec();
            } else {
                //匹配失败
                $procedure.next("end").exec("搜索失败");
            }
        },
        "end": function (message) {
            this.buffer_id = 1;
            if (message) {
                $log(message, "danger");
            } else {
                $log("搜索成功", "success");
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

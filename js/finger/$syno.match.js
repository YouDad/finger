{
    let procedures = {
        "begin": async function (message) {
            let finger_id = {};
            await $bus.$emit("get_finger_id", finger_id);
            finger_id = finger_id.finger_id;

            let datas = [2, finger_id / 256, finger_id % 256];

            let data_package = (await $syno.request($syno.LoadChar, datas))[0];
            $port.write(data_package);
            $procedure.next("get_image");
            if (message) {
                $log(message);
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
                let data_package = (await $syno.request($syno.UpImage))[0];
                $port.write(data_package);
                $procedure.next("show_image");
            } else {
                let data_package = (await $syno.request($syno.GetImage))[0];
                $port.write(data_package);
                $procedure.next("up_image");
            }
        },
        "show_image": async function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                $bus.$emit("show_image", result);

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
                $log(`分数: ${result.data[0] * 256 + result.data[1]}`);
                $procedure.next("end").exec();
            } else {
                //匹配失败
                $procedure.next("end").exec("匹配失败");
            }
        },
        "end": function (message) {
            this.buffer_id = 1;
            if (message)
                $log(message);
            else
                $log("success");
            $procedure.kill();
        },
    };

    $procedure.define("$syno.match", procedures);
}
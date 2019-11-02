{
    let procedures = {
        finger_id: 0,
        "begin": async function () {
            this.finger_id = await icc_get_finger_id();

            let datas = [this.finger_id / 256, this.finger_id % 256, 0, 1];

            let data_package = (await $syno.request($syno.DeleteChar, datas))[0];
            $port.write(data_package);
            $procedure.next("parse_data");
        },
        "parse_data": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $user_log(`删除指纹${this.finger_id}：${$syno.explain(result.retval)}`,
                result.retval ? "danger" : "info");

            $procedure.add("$syno.validchar");
            $procedure.kill();
        },
    };

    $procedure.define("$syno.delchar", procedures);
}

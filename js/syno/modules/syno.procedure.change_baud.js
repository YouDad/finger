{
    let procedures = {
        data: 0,
        "clean": async function () {
            this.data = 0;
        },
        "begin": async function (data) {
            this.data = data;
            let datas = [4, data.use];
            let data_package = (await $syno.request($syno.WriteReg, datas))[0];
            $port.write(data_package);
            $procedure.next("process_retval");
        },
        "process_retval": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $user_log(`修改波特率(${this.data.see})：${$syno.explain(result.retval)},重新打开设备后生效`,
                result.retval ? "danger" : "success");
            $procedure.add("$syno.get_devinfo");
            $procedure.kill();
        },
    };

    $procedure.define("$syno.change_baud", procedures);
}

{
    let procedures = {
        data: 0,
        "begin": async function (data) {
            this.data = data;
            let datas = [5, data.use];
            let data_package = (await $syno.request($syno.WriteReg, datas))[0];
            $port.write(data_package);
            $procedure.next("process_retval");
        },
        "process_retval": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            $user_log(`修改安全等级(${this.data.see})：` + $syno.explain(result.retval),
                result.retval ? "error" : "info");
            $procedure.load("$syno.get_devinfo").exec();
        },
    };

    $procedure.define("$syno.change_seclvl", procedures);
}

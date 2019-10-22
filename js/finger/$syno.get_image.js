{
    let procedures = {
        continued: false,
        "begin": async function (continued) {
            if (continued === true) {
                this.continued = true;
            } else if (continued !== undefined) {
                $user_log(continued, "warning");
            }
            let data_package = (await $syno.request($syno.GetImage))[0];
            $port.write(data_package);
            $procedure.next("process_get_image");
        },
        "process_get_image": async function (data) {
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
        "show_image": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));
            if (result.retval == 0x00) {
                $bus.$emit("show_image", result);
            }
            if (this.continued) {
                $procedure.next("begin").exec();
            } else {
                $procedure.kill();
            }
        },
    };

    $procedure.define("$syno.get_image", procedures);
}

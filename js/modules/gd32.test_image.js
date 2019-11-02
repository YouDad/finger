{
    let procedures = {
        continued: false,
        "begin": async function (continued) {
            if (continued === true) {
                this.continued = true;
            } else if (continued !== undefined) {
                $user_log(continued, "warning");
            }
            let data_package = (await $gd32.request($gd32.GetTestImage))[0];
            $port.write(data_package);
            $procedure.next("process_get_image");
        },
        "process_get_image": async function (data) {
            let result = $gd32.parse(data);
            icc_show_image(result);
            $user_log("采图成功", "success");
            if (this.continued) {
                $procedure.next("begin").exec();
            } else {
                $procedure.kill();
            }
        },
    };

    $procedure.define("$gd32.get_image", procedures);
}

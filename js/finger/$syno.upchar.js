{
    let procedures = {
        continued: false,
        "begin": async function (message) {
            if (message === true) {
                this.continued = true;
            }
            let data_package = (await $syno.request($syno.UpChar))[0];
            $port.write(data_package);
            $procedure.next("up_image");
            if (message) {
                $log(message);
            }
        },
        // TODO: 先load,再up
    };

    $procedure.define("$syno.upchar", procedures);
}

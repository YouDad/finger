{
    let procedures = {
        "begin": function (port) {
            port.write("\xef\x01\xff\xff\xff\xff\x01\x00\x07\x13\x00\x00\x00\x00\x00\x1b", "binary");
            $procedure.next("process_vfy_pwd");
        },
        "process_vfy_pwd": function (data) {
            console.log(data);
        },
    };

    $procedure.define("syno.vfy_pwd", procedures);
}

{
    let procedures = {
        data: [],
        "begin": async function (text) {
            this.data = text === undefined ? this.data : text.slice(0, text.length);
            let datas = [16 - this.data.length / 32].concat(this.data.splice(0, 32));
            icc_set_notepad_progress(100 - this.data.length / 32 / 16 * 100);
            let data_package = (await $syno.request($syno.WriteNotepad, datas))[0];
            $port.write(data_package);
            $procedure.next("process_retval");
        },
        "process_retval": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));

            if (result.retval !== 0) {
                $user_log(`写记事本：${$syno.explain(result.retval)}`, "danger");
                $procedure.kill();
            }

            if (this.data.length === 0) {
                $user_log(`写记事本：${$syno.explain(result.retval)}`, "success");
                $procedure.kill();
            } else {
                $procedure.next("begin").exec();
            }
        },
    };

    $procedure.define("$syno.write_notepad", procedures);
}

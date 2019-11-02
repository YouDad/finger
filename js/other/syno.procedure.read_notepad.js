{
    let procedures = {
        data: [],
        "begin": async function () {
            let data_package = (await $syno.request($syno.ReadNotepad, [this.data.length / 32]))[0];
            $port.write(data_package);
            $procedure.next("parse_data");
        },
        "parse_data": function (data) {
            let result = $syno.parse(data);
            $log($syno.explain(result.retval));

            if (result.retval !== 0) {
                $user_log("读记事本：" + $syno.explain(result.retval), "danger");
                $procedure.kill();
            }

            for (let i = 0; i < result.data.length; i++) {
                this.data.push(result.data[i]);
            }

            $bus.$emit("notepad_progress", this.data.length / 32 / 16 * 100);

            if (this.data.length === 512) {
                $bus.$emit("notepad", this.data);
                $user_log(`读记事本：${$syno.explain(result.retval)}`,
                    result.retval ? "danger" : "success");
                $procedure.kill();
            } else {
                $procedure.next("begin").exec();
            }
        },
    };

    $procedure.define("$syno.read_notepad", procedures);
}

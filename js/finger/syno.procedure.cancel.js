{
    let procedures = {
        "begin": async function () {
            $user_log("取消操作", "warning");
            $procedure.next("loop");
        },
        "loop": async function () {
            
        },
    };

    $procedure.define("$syno.cancel", procedures);
}

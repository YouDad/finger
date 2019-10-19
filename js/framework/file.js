{
    let procedures = {
        fs: window.fs,
        os: window.os,
        join: window.path_join,
        dir_path: join(os.tmpdir(), "finger"),
        "begin": function () {
            let that = this;
            this.fs.exists(this.dir_path, function (exists) {
                if (exists === false) {
                    that.fs.mkdir(that.dir_path, function () {
                        $procedure.next("end").exec();
                    });
                }
            });
        },
        "end": function () {
            $bus.$on("", function () {

            });
        },
    };

    $procedure.define("file", procedures);
    $procedure.load("file").exec();
}

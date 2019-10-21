{
    let base_dir = path_join(os.tmpdir(), "finger");
    let char_dir = path_join(base_dir, "char");

    function make_sure_dir_exist(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    function get_filename() {
        return moment().format("YYYY.MM.DD.HH_mm_ss_");
    }

    make_sure_dir_exist(base_dir);
    make_sure_dir_exist(char_dir);

    $bus.$on("save_char", function (data) {
        let fd;
        try {
            let filename = path_join(char_dir, get_filename() + data.finger_id + ".char");
            fd = fs.openSync(filename, "w");
            fs.writeSync(fd, Uint8Array.from(data.data));
            $bus.$emit("notify.success", filename + " 保存成功");
            $user_log("notify.success" + filename + " 保存成功");
        } catch (err) {
            console.error(err);
        } finally {
            if (fd === undefined) {
                return;
            }
            fs.closeSync(fd);
        }
    });
}

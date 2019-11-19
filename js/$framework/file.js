{
    let base_dir = path_join(os.tmpdir(), "finger");
    let char_dir = path_join(base_dir, "char");
    let image_dir = path_join(base_dir, "image");

    function make_sure_dir_exist(dir) {
        if (!fs.existsSync(dir)) {
            console.log(`${dir}不存在，创建!`);
            fs.mkdirSync(dir);
        }
    }

    function get_filename() {
        return moment().format("YYYY.MM.DD.HH_mm_ss");
    }

    make_sure_dir_exist(base_dir);
    make_sure_dir_exist(char_dir);
    make_sure_dir_exist(image_dir);

    icc_define_icc("save_char", function (data) {
        let fd;
        try {
            let filename = path_join(char_dir, `${get_filename()}_${data.finger_id}.char`);
            fd = fs.openSync(filename, "w");
            fs.writeSync(fd, Uint8Array.from(data.data));
            $user_log(`${filename} 保存成功`);
        } catch (err) {
            console.error(err);
        } finally {
            if (fd === undefined) {
                return;
            }
            fs.closeSync(fd);
        }
    });

    icc_define_icc("save_png", function (buffer) {
        let fd;
        try {
            let filename = path_join(image_dir, get_filename() + ".png");
            fd = fs.openSync(filename, "w");
            fs.writeSync(fd, buffer);
            $user_log(`${filename} 保存成功`);
        } catch (err) {
            console.error(err);
        } finally {
            if (fd === undefined) {
                return;
            }
            fs.closeSync(fd);
        }
    });

    icc_define_icc("save_bmp", function (buffer) {
        let fd;
        try {
            let bmp_header = path_join(__project, "css", "bmp_header.160x160");
            let filename = path_join(image_dir, get_filename() + ".bmp");
            fs.copyFileSync(bmp_header, filename);
            fd = fs.openSync(filename, "a");
            fs.writeSync(fd, buffer);
            $user_log(`${filename} 保存成功`);
        } catch (err) {
            console.error(err);
        } finally {
            if (fd === undefined) {
                return;
            }
            fs.closeSync(fd);
        }
    });

    icc_define_icc("open_explorer", function (data) {
        exec(`explorer ${base_dir}`);
        exec(`nautilus ${base_dir}`);
    });
}

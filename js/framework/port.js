{
    $port = {
        port: { message: "undefined" },
        total_datas: [],
        interval_id: 0,
        open: function (data) {
            let that = this;
            that.port = new serial_port(data.device, {
                baudRate: parseInt(data.baud),
            });
            that.port.on("error", function (err) {
                $log(`$port.error: ${err.message}`, "error");
            });
            that.port.on("disconnect", function () {
                $log(`$port.disconnect: ${that.port.path}`);

            });
            that.port.on("open", async function () {
                $log(`$port.open: ${that.port.path}`);
                await data.func();
            });
            that.port.on("close", function () {
                $log(`$port.close: ${that.port.path}`);

            });
            that.port.on("data", async function (a) {
                console.log(`$port.data: ${that.port.path}`, a);
                for (let i = 0; i < a.length; i++) {
                    that.total_datas.push(a[i]);
                }
                if (that.interval_id) {
                    clearInterval(that.interval_id);
                }
                that.interval_id = setInterval(async function () {
                    clearInterval(that.interval_id);
                    await $procedure.exec(that.total_datas);
                    that.total_datas = [];
                }, 100);
            })
        },
        close: function () {
            let that = this;
            if (that.port.message === "undefined") {
                $user_log("串口未打开，关闭失败", "error");
                return;
            }
            that.port.close();
        },
        write: function (arr) {
            let that = this;
            if (that.port.message === "undefined") {
                $user_log("串口未打开，写入失败", "error");
                $procedure.kill();
                return;
            }
            console.log(`$port.write: ${that.port.path}`, arr);
            that.port.write(Uint8Array.from(arr), "binary");
        },
    };
}

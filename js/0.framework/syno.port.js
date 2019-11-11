{
    $port = {
        port: { message: "undefined" },
        total_datas: [],
        interval_id: 0,
        open: function (data) {
            this.port = new serial_port(data.device, {
                baudRate: parseInt(data.baud),
            });
            this.port.on("error", err => {
                $log(`$port.error: ${err.message}`, "danger");
                $test_log(`$port.error: ${err.message}`, "danger");
            });
            this.port.on("disconnect", () => {
                $log(`$port.disconnect: ${this.port.path}`);
                $test_log(`$port.disconnect: ${this.port.path}`);

            });
            this.port.on("open", async () => {
                $log(`$port.open: ${this.port.path}`);
                $test_log(`$port.open: ${this.port.path}`);
                await data.func();
            });
            this.port.on("close", () => {
                $log(`$port.close: ${this.port.path}`);
                $test_log(`$port.close: ${this.port.path}`);

            });
            this.port.on("data", async a => {
                console.log(`$port.data: ${this.port.path}`, a);
                for (let i = 0; i < a.length; i++) {
                    this.total_datas.push(a[i]);
                }
                if (this.interval_id) {
                    clearInterval(this.interval_id);
                }
                this.interval_id = setInterval(async () => {
                    clearInterval(this.interval_id);
                    await $procedure.exec(this.total_datas);
                    $test_log("$port.read: "+this.total_datas.toString());
                    this.total_datas = [];
                }, 100);
            })
        },
        close: function () {
            if (this.port.message === "undefined") {
                $user_log("串口未打开，关闭失败", "danger");
                return;
            }
            this.port.close();
        },
        write: function (arr) {
            if (this.port.message === "undefined") {
                $user_log("串口未打开，写入失败", "danger");
                $procedure.kill();
                return;
            }
            console.log(`$port.write: ${this.port.path}`, arr);
            $test_log("$port.write: "+arr.toString());
            this.port.write(Uint8Array.from(arr), "binary");
        },
    };
}

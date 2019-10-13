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
                console.error(`$port.error: ${err.message}`);
            });
            that.port.on("disconnect", function () {
                console.log(`$port.disconnect: ${that.port.path}`);

            });
            that.port.on("open", async function () {
                console.log(`$port.open: ${that.port.path}`);
                await data.func();
            });
            that.port.on("close", function () {
                console.log(`$port.close: ${that.port.path}`);

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
            if (that.port.message == "undefined") {
                return;
            }
            that.port.close();
        },
        write: function (arr) {
            let that = this;
            if (that.port.message == "undefined") {
                $procedure.kill();
                return;
            }
            that.port.write(Uint8Array.from(arr), "binary");
        },
    };
}
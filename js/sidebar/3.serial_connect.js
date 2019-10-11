{
    let template = `
        <div :style="css_luwh_serial_connect">
            <div class="input-group">
                <span class="input-group-addon">地址</span>
                <input type="text" class="form-control"
                placeholder="8个16进制数 FFFFFFFF" v-model="address">
            </div>
            <div class="input-group">
                <span class="input-group-addon">密码</span>
                <input type="text" class="form-control"
                placeholder="8个16进制数 00000000" v-model="password">
            </div>
            <button class="btn btn-primary" @click="connect" v-show="!is_connected">连接设备!</button>
            <button class="btn btn-danger" @click="disconnect" v-show="is_connected">断开连接!</button>
        </div>
    `;

    //glyphicon glyphicon-log-in
    //glyphicon glyphicon-log-out
    //glyphicon glyphicon-import
    //glyphicon glyphicon-export

    let data_css = function () {
        return {
            css_luwh_serial_connect: {

            },
            is_connected: false,
            address: "",
            password: "",
            port: null,
        }
    };

    let methods = {
        connect: async function (e) {
            let that = this;
            let data = {};
            await $bus.request("get_baud", data);
            await $bus.request("get_device", data);

            port = new serial_port(data.device, {
                baudRate: parseInt(data.baud),
            });
            port.on("error", function (err) {
                console.error(`error: ${err.message}`);
            });
            port.on("disconnect", function () {
                console.log(`disconnect: ${port.path}`);

            });
            port.on("open", async function () {
                console.log(`open: ${port.path}`);
                $procedure.load("syno.vfy_pwd").exec(port);
            });
            port.on("close", function () {
                console.log(`close: ${port.path}`);

            });
            port.on("data", function (a) {
                console.log(`data: ${port.path}`, a);
                $procedure.exec(a);
            })

            that.is_connected = true;
        },
        disconnect: function (e) {
            let that = this;
            that.is_connected = false;
        },
    };

    Vue.component('luwh_serial_connect', {
        template: template,
        data: data_css,
        methods: methods,
        mounted: function () {
            // 加载默认值
        },
    });
}

{
    let template = `
        <div :style="css_luwh_serial_connect">
            <div class="input-group" :style="css_address">
                <span class="input-group-addon">地址</span>
                <input type="text" class="form-control"
                placeholder="8个16进制数" v-model="address">
            </div>
            <div class="input-group" :style="css_password">
                <span class="input-group-addon">密码</span>
                <input type="text" class="form-control"
                placeholder="8个16进制数" v-model="password">
            </div>
            <button class="btn btn-primary btn-block" @click="connect" v-show="!is_connected" :style="css_button">连接设备!</button>
            <button class="btn btn-danger btn-block" @click="disconnect" v-show="is_connected" :style="css_button">断开连接!</button>
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
            css_address: {
                'padding-bottom': '0.25em',
            },
            css_password: {
                'padding-bottom': '0.25em',
            },
            css_button: {

            },
            is_connected: false,
            address: "FFFFFFFF",
            password: "00000000",
        }
    };

    let methods = {
        connect: async function (e) {
            let that = this;
            let data = {
                func: async function () {
                    await $procedure.load("$syno.vfy_pwd").exec();
                }
            };
            await $bus.$emit("get_baud", data);
            await $bus.$emit("get_device", data);

            $port.open(data);
            that.is_connected = true;
        },
        disconnect: function (e) {
            let that = this;
            $port.close();
            that.is_connected = false;
        },
    };

    Vue.component('luwh_serial_connect', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            let that = this;
            $bus.$on("get_address", function (data) {
                data.address = that.address;
            });
            $bus.$on("get_password", function (data) {
                data.password = that.password;
            });
            $bus.$on("set_address", function (data) {
                that.address = data.address;
            });
        },
    });
}

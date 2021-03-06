{
    let template = `
        <div :style="css_syno_serial_connect">
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
            <button class="btn btn-primary btn-block" @click="connect" v-if="!is_connected" :style="css_button">连接设备!</button>
            <button class="btn btn-danger btn-block" @click="disconnect" v-if="is_connected" :style="css_button">断开连接!</button>
        </div>
    `;

    //glyphicon glyphicon-log-in
    //glyphicon glyphicon-log-out
    //glyphicon glyphicon-import
    //glyphicon glyphicon-export

    let data_css = function () {
        return {
            css_syno_serial_connect: {

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
                func: function () {
                     $procedure.load("$syno.vfy_pwd").exec();
                }
            };
            data.baud = await icc_get_baud();
            data.device = await icc_get_device();

            $port.open(data);
            that.is_connected = true;
        },
        disconnect: function (e) {
            let that = this;
            $port.close();
            that.is_connected = false;
        },
    };

    Vue.component('syno_serial_connect', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            icc_define_icc("get_address", data => data.address = this.address);
            icc_define_icc("get_password", data => data.password = this.password);
            icc_define_icc("set_address", data => this.address = data.address);
            icc_define_icc("connect_failed", data => this.is_connected = false);
        },
    });
}

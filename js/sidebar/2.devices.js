{
    let template = `
        <div>
            <div class="dropdown" :style="css1">
                <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    设备: {{ now_device }}<span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <button class="btn btn-default btn-block"
                        v-for="device in devices"
                        @click="click_serial">{{ device.comName }} ({{device.manufacturer}})</button>
                </ul>
            </div>
            <button class="btn btn-primary" :style="css2"
                @click="flash_serial">刷新串口列表</button>
        </div>
    `;

    let data_css = function () {
        return {
            now_device: "",
            devices: [],
            css1: {
                // 'position': 'absolute',
                // 'left': '0',
                // 'top': '0',
            },
            css2: {
                // 'position': 'absolute',
                // 'left': '8.5em',
                // 'top': '0',
            },
        };
    };

    let methods = {
        click_serial: function (e) {
            let that = this;
            that.now_device = $(e.target).text();
        },
        flash_serial: function () {
            let that = this;
            that.devices.length = 0;
            serial_port.list(function (err, ports) {
                ports.forEach(function (port) {
                    console.log(port);
                    if (port.comName != undefined &&
                        port.pnpId != undefined &&
                        port.manufacturer != undefined) {
                        that.devices.push(port);
                        if (that.now_device == "") {
                            that.now_device = `${port.comName} (${port.manufacturer})`;
                        }
                    }
                });
            });
        },
    };

    Vue.component('luwh_devices', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            let that = this;
            $bus.response("get_device", function (data) {
                data.device = that.now_device.split(" ")[0];
            });
        },
        mounted: methods.flash_serial,
    });
}

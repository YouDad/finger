{
    let template = `
        <div :style="css_luwh_devinfo">
            <button class="btn btn-primary" data-toggle="collapse" data-target=".collapse" aria-expanded="false" aria-controls=".collapse">
                Button with data-target
            </button>
            <div class="collapse show">
                <ul class="list-group">
                    <li class="list-group-item">指纹库大小: {{DataBaseSize}}</li>
                    <li class="list-group-item">安全等级: {{SecurLevel}}</li>
                    <li class="list-group-item">数据包大小: {{CFG_PktSize}}</li>
                    <li class="list-group-item">波特率系数: {{CFG_BaudRate}}</li>
                    <li class="list-group-item">产品型号: {{ProductSN}}</li>
                    <li class="list-group-item">软件版本: {{SoftwareVersion}}</li>
                    <li class="list-group-item">厂家名称: {{Manufacturer}}</li>
                    <li class="list-group-item">传感器名称: {{SensorName}}</li>
                    <button class="list-group-item" @click="flash_devinfo">刷新设备信息</button>
                </ul>
            </div>
            <div class="collapse">
                <ul class="list-group">
                    <li class="list-group-item">状态寄存器: {{SSR}}</li>
                    <li class="list-group-item">传感器类型: {{SensorType}}</li>
                    <li class="list-group-item">设备地址: {{DeviceAddress}}</li>
                    <li class="list-group-item">密码: {{PassWord}}</li>
                    <li class="list-group-item">Jtag锁定标志: {{JtagLockFlag}}</li>
                    <li class="list-group-item">传感器初始化程序入口: {{SensorInitEntry}}</li>
                    <li class="list-group-item">录入图像程序入口: {{SensorGetImageEntry}}</li>
                    <li class="list-group-item">参数表有效标志: {{ParaTableFlag}}</li>
                    <button class="list-group-item" @click="flash_devinfo">刷新设备信息</button>
                </ul>
            </div>
        </div>
    `;

    let data_css = function () {
        return {
            css_luwh_devinfo: {
                '': '',
            },
            devinfo_word: [],
            devinfo_str: "",
        }
    };

    let methods = {
        flash_devinfo: async function (e) {
            let that = this;
            await $procedure.load("$syno.get_devinfo").exec();
        },
        print_hex: function (a, b) {
            let str = "";
            if (this.devinfo_word.length >= 64) {
                str = this.devinfo_word[a];
                if (b) {
                    str <<= 16;
                    str += this.devinfo_word[b];
                }
                str.toString(16);
                while (str.length < (b > 0 ? 8 : 4))
                    str = "0" + str;
                str = "0x" + str;
            }
            return str;
        }
    };

    // TODO: 内容分解，(i){1~3:xxx 4~6:xxx}
    let computed = {
        SSR: function () { return this.devinfo_word[0]; },
        SensorType: function () { return this.devinfo_word[1]; },
        DataBaseSize: function () { return this.devinfo_word[2]; },
        SecurLevel: function () {
            switch (this.devinfo_word[3]) {
                case undefined: return "";
                case 1: return "1 (lowest)";
                case 2: return "2 (low)";
                case 3: return "3 (middle)";
                case 4: return "4 (high)";
                case 5: return "5 (highest)";
                default: return this.devinfo_word[3] + " (unknown)";
            }
        },
        DeviceAddress: function () { return this.print_hex(4, 5); },
        CFG_PktSize: function () {
            switch (this.devinfo_word[6]) {
                case undefined: return "";
                case 0: return "32bytes";
                case 1: return "64bytes";
                case 2: return "128bytes";
                case 3: return "256bytes";
                default: return "unknown";
            }
        },
        CFG_BaudRate: function () {
            if (this.devinfo_word[7] === undefined) {
                return "";
            }
            return this.devinfo_word[7] * 9600;
        },
        ProductSN: function () { return this.devinfo_str.slice(28, 28 + 8); },
        SoftwareVersion: function () { return this.devinfo_str.slice(36, 36 + 8); },
        Manufacturer: function () { return this.devinfo_str.slice(44, 44 + 8); },
        SensorName: function () { return this.devinfo_str.slice(52, 52 + 8); },
        PassWord: function () { return this.print_hex(30, 31); },
        JtagLockFlag: function () { return this.print_hex(32, 33); },
        SensorInitEntry: function () { return this.print_hex(34); },
        SensorGetImageEntry: function () { return this.print_hex(35); },
        ParaTableFlag: function () { return this.print_hex(63); },
    };

    Vue.component('luwh_devinfo', {
        template: template,
        data: data_css,
        methods: methods,
        computed: computed,
        created: function () {
            let that = this;
            $bus.$on("set_devinfo", function (r) {
                r = r.data;
                that.devinfo_word = [];
                that.devinfo_str = "";
                for (let i = 0; i < 64; i++) {
                    that.devinfo_word.push(r[i * 2] * 256 + r[i * 2 + 1]);
                    that.devinfo_str += String.fromCharCode(r[i * 2]);
                    that.devinfo_str += String.fromCharCode(r[i * 2 + 1]);
                }
            });
            $bus.$on("get_dbsize", function (dbsize) {
                dbsize.dbsize = that.DataBaseSize;
            });
            $bus.$on("get_devinfo", async function () {
                await that.flash_devinfo();
            });
        },
        mounted: function () {

        },
    });
}

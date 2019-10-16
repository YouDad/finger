{
    let template = `
        <div :style="css_luwh_devinfo">
            <button class="list-group-item" :style="css_button" @click="show_now++;">
                查看另外的信息
            </button>
            <button class="list-group-item" @click="flash_devinfo">
                刷新硬件信息
            </button>
            <div v-show="show_now%4==0">
                <ul class="list-group">
                    <li class="list-group-item">1 指纹库大小: {{DataBaseSize}}</li>
                    
                    <li class="list-group-item">
                        <div v-show="show_2">2 安全等级: {{SecurLevel}}</div>
                        <button v-show="show_2"
                            class="btn btn-default glyphicon glyphicon-edit"
                            :style="css_edit" @click="show_2=!show_2;temp_seclvl=SecurLevel;"/>

                        <div class="dropdown" v-show="!show_2">
                            <button :style="css_list" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                2 安全等级: {{ temp_seclvl }} <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" style="padding:0.25em;">
                                <button class="btn btn-default btn-block"
                                    v-for="level in ['1 (lowest)','2 (low)','3 (middle)','4 (high)','5 (highest)']" v-once
                                    @click="temp_seclvl=level;">{{ level }}</button>
                            </ul>
                        </div>
                        <button v-show="!show_2"
                            class="btn btn-default glyphicon glyphicon-save"
                            :style="css_edit" @click="show_2=!show_2;change_secur_level();"/>
                    </li>

                    <li class="list-group-item">
                        <div v-show="show_3">3 数据包大小: {{CFG_PktSize}}bytes</div>
                        <button v-show="show_3"
                            class="btn btn-default glyphicon glyphicon-edit"
                            :style="css_edit" @click="show_3=!show_3;temp_pktsize=CFG_PktSize;"/>

                        <div class="dropdown" v-show="!show_3">
                            <button :style="css_list" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                3 数据包大小: {{ temp_pktsize }}bytes <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" style="padding:0.25em;">
                                <button class="btn btn-default btn-block"
                                    v-for="PktSize in [32,64,128,256]" v-once
                                    @click="temp_pktsize=PktSize;">{{ PktSize }}</button>
                            </ul>
                        </div>
                        <button v-show="!show_3"
                            class="btn btn-default glyphicon glyphicon-save"
                            :style="css_edit" @click="show_3=!show_3;change_packet_size();"/>
                    </li>

                    <li class="list-group-item">
                        <div v-show="show_4">4 波特率: {{CFG_BaudRate}}</div>
                        <button v-show="show_4"
                            class="btn btn-default glyphicon glyphicon-edit"
                            :style="css_edit" @click="show_4=!show_4;temp_baud=CFG_BaudRate;"/>

                        <div class="dropdown" v-show="!show_4">
                            <button :style="css_list" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                4 波特率: {{ temp_baud }} <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" style="padding:0.25em;">
                                <button class="btn btn-default btn-block"
                                    v-for="BaudRate in [9600,57600,115200]" v-once
                                    @click="temp_baud=BaudRate;">{{ BaudRate }}</button>
                            </ul>
                        </div>
                        <button v-show="!show_4"
                            class="btn btn-default glyphicon glyphicon-save"
                            :style="css_edit" @click="show_4=!show_4;change_baud();"/>
                    </li>
                </ul>
            </div>
            <div v-show="show_now%4==1">
                <ul class="list-group">
                    <li class="list-group-item">5 产品型号: {{ProductSN}}</li>
                    <li class="list-group-item">6 软件版本: {{SoftwareVersion}}</li>
                    <li class="list-group-item">7 厂家名称: {{Manufacturer}}</li>
                    <li class="list-group-item">8 传感器名称: {{SensorName}}</li>
                </ul>
            </div>
            <div v-show="show_now%4==2">
                <ul class="list-group">
                <li class="list-group-item">9 状态寄存器: {{SSR}}</li>
                <li class="list-group-item">10 传感器类型: {{SensorType}}</li>

                <li class="list-group-item">
                    <div v-show="show_11">11 设备地址: {{DeviceAddress}}</div>
                    <button v-show="show_11"
                        class="btn btn-default glyphicon glyphicon-edit"
                        :style="css_edit" @click="show_11=!show_11;temp_address=DeviceAddress;"/>

                    <div class="input-group" v-show="!show_11" :style="css_input">
                        <span class="input-group-addon">11 设备地址:</span>
                        <input v-model="temp_address" type="text" class="form-control" placeholder="十六进制数">
                    </div>
                    <button v-show="!show_11"
                        class="btn btn-default glyphicon glyphicon-save"
                        :style="css_edit" @click="show_11=!show_11;change_address();"/>
                </li>

                <li class="list-group-item">
                    <div v-show="show_12">12 设备密码: {{DevicePassword}}</div>
                    <button v-show="show_12"
                        class="btn btn-default glyphicon glyphicon-edit"
                        :style="css_edit" @click="show_12=!show_12;temp_password=DevicePassword;"/>

                    <div class="input-group" v-show="!show_12" :style="css_input">
                        <span class="input-group-addon">12 设备密码:</span>
                        <input v-model="temp_password" type="text" class="form-control" placeholder="十六进制数">
                    </div>
                    <button v-show="!show_12"
                        class="btn btn-default glyphicon glyphicon-save"
                        :style="css_edit" @click="show_12=!show_12;change_password();"/>
                </li>

                </ul>
            </div>
            <div v-show="show_now%4==3">
                <ul class="list-group">
                <li class="list-group-item">13 Jtag锁定标志: {{JtagLockFlag}}</li>
                <li class="list-group-item">14 传感器初始化程序入口: {{SensorInitEntry}}</li>
                <li class="list-group-item">15 录入图像程序入口: {{SensorGetImageEntry}}</li>
                <li class="list-group-item">16 参数表有效标志: {{ParaTableFlag}}</li>
                </ul>
            </div>
        </div>
    `;

    let data_css = function () {
        return {
            css_luwh_devinfo: {
                'width': '21em',
                'padding': '1em',
                'border-radius': '0.5em',
                'border': '0.5em solid #d9edf7',
            },
            css_button: {
                'position': 'absolute',
                'margin-left': '8em',
                'z-index': '1',
                'width': '10em',
            },
            css_edit: {
                'position': 'absolute',
                'right': '0',
                'margin': '0.15em',
            },
            css_list: {
                'margin-top': '-1.05em',
                'margin-bottom': '-0.84em',
                'margin-left': '-0.928em',
            },
            css_input: {
                'margin-top': '-0.53em',
                'margin-bottom': '-0.5em',
                'margin-left': '-0.9425em',
                'width': '90%',
            },
            devinfo_word: [],
            devinfo_str: "",
            show_now: 0,
            show_2: true,
            show_3: true,
            show_4: true,
            show_11: true,
            show_12: true,
            temp_seclvl: "",
            temp_pktsize: "",
            temp_baud: "",
            temp_address: "",
            temp_password: "",
        }
    };

    let methods = {
        flash_devinfo: function (e) {
            let that = this;
            $procedure.load("$syno.get_devinfo").exec();
        },
        print_hex: function (a, b) {
            let str = "";
            if (this.devinfo_word.length >= 64) {
                str = this.devinfo_word[a];
                if (b) {
                    str *= 65536;
                    str += this.devinfo_word[b];
                }
                str = str.toString(16);
                while (str.length < (b > 0 ? 8 : 4))
                    str = "0" + str;
                str = "0x" + str;
            }
            return str;
        },
        change_secur_level: function () {
            let that = this;
            let data = { see: that.temp_seclvl };
            data.use = that.temp_seclvl[0];
            $procedure.load("$syno.change_seclvl").exec(data);
        },
        change_packet_size: function () {
            let that = this;
            let data = { see: that.temp_pktsize };
            switch (that.temp_pktsize) {
                case "32": data.use = 0; break;
                case "64": data.use = 1; break;
                case "128": data.use = 2; break;
                case "256": data.use = 3; break;
            }
            $procedure.load("$syno.change_pktsize").exec(data);
        },
        change_baud: function () {
            let that = this;
            let data = { see: that.temp_baud };
            data.use = that.temp_baud / 9600;
            $procedure.load("$syno.change_baud").exec(data);
        },
        change_address: function () {
            let that = this;
            let data = { see: that.temp_address };
            data.use = that.temp_address.replace("0x", "").replace("0X", "");
            $procedure.load("$syno.change_address").exec(data);
        },
        change_password: function () {
            let that = this;
            let data = { see: that.temp_password };
            data.use = that.temp_password.replace("0x", "").replace("0X", "");
            $procedure.load("$syno.change_password").exec(data);
        },
    };

    // TODO: 内容分解，(i){1~3:xxx 4~6:xxx}
    let computed = {
        SSR: function () { return this.devinfo_word[0]; },
        SensorType: function () { return this.devinfo_word[1]; },
        DataBaseSize: function () { return this.devinfo_word[2]; },
        SecurLevel: {
            set: function (value) {
                this.devinfo_word[64] = 0;
                this.devinfo_word[3] = value;
            },
            get: function () {
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
        },
        DeviceAddress: {
            set: function (value) {
                this.devinfo_word[64] = 0;
                this.devinfo_word[4] = Math.floor(value / 65536);
                this.devinfo_word[5] = value % 65536;
            },
            get: function () {
                return this.print_hex(4, 5);
            }
        },
        CFG_PktSize: {
            set: function (value) {
                this.devinfo_word[64] = 0;
                switch (value) {
                    case 32: this.devinfo_word[6] = 0; break;
                    case 64: this.devinfo_word[6] = 1; break;
                    case 128: this.devinfo_word[6] = 2; break;
                    case 256: this.devinfo_word[6] = 3; break;
                }
            },
            get: function () {
                switch (this.devinfo_word[6]) {
                    case undefined: return "";
                    case 0: return "32";
                    case 1: return "64";
                    case 2: return "128";
                    case 3: return "256";
                    default: return "unknown";
                }
            }
        },
        CFG_BaudRate: {
            set: function (value) {
                this.devinfo_word[64] = 0;
                this.devinfo_word[7] = Math.floor(value / 9600);
            },
            get: function () {
                if (this.devinfo_word[7] === undefined) {
                    return "";
                }
                return this.devinfo_word[7] * 9600;
            }
        },
        ProductSN: function () { return this.devinfo_str.slice(28, 28 + 8); },
        SoftwareVersion: function () { return this.devinfo_str.slice(36, 36 + 8); },
        Manufacturer: function () { return this.devinfo_str.slice(44, 44 + 8); },
        SensorName: function () { return this.devinfo_str.slice(52, 52 + 8); },
        DevicePassword: {
            set: function (value) {
                this.devinfo_word[64] = 0;
                this.devinfo_word[30] = Math.floor(value / 65536);
                this.devinfo_word[31] = value % 65536;
            },
            get: function () {
                return this.print_hex(30, 31);
            }
        },
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
                if (r.length > 0) {
                    for (let i = 0; i < 64; i++) {
                        that.devinfo_word.push(r[i * 2] * 256 + r[i * 2 + 1]);
                        that.devinfo_str += String.fromCharCode(r[i * 2]);
                        that.devinfo_str += String.fromCharCode(r[i * 2 + 1]);
                    }
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

{
    let template = `
        <div :style="css_gd32_devinfo">
            <button class="list-group-item" @click="flash_devinfo">
                刷新硬件信息
            </button>
            <div>
                <ul class="list-group">
                    <li class="list-group-item">1 芯片版本: {{ChipVersion}}</li>
                    <li class="list-group-item">2 固件版本: {{FirmVersion}}</li>
                    <li class="list-group-item">3 编译日期: {{CompileDate}}</li>
                    <li class="list-group-item">4 编译时间: {{CompileTime}}</li>
                </ul>
            </div>
        </div>
    `;

    let data_css = function () {
        return {
            css_gd32_devinfo: {
                'width': '21em',
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
            },
            devinfo_str: "",
        }
    };

    let methods = {
        flash_devinfo: function (e) {
            $procedure.load("$gd32.get_devinfo").exec();
        },
    };

    let computed = {
        ChipVersion: function () { return devinfo_str.slice(0, 0 + 1); },
        FirmVersion: function () { return devinfo_str.slice(1, 1 + 9); },
        CompileDate: function () { return devinfo_str.slice(11, 11 + 11); },
        CompileTime: function () { return devinfo_str.slice(23, 23 + 8); },
    };

    Vue.component('gd32_devinfo', {
        template: template,
        data: data_css,
        methods: methods,
        computed: computed,
        created: function () {
            icc_define_icc("set_devinfo", r => {
                r = r.data;
                this.devinfo_str = "";
                if (r.length > 0) {
                    for (let i = 0; i < 31; i++) {
                        this.devinfo_str += String.fromCharCode(r[i]);
                    }
                }
            });
        },
    });
}

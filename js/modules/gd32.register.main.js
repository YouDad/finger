{
    let template = `
        <div :style="css_div">
            <div class="input-group" :style="css_input">
                <span class="input-group-addon">地址</span>
                <input type="text" class="form-control"
                placeholder="0x??" v-model="address">
            </div>
            <div class="input-group" :style="css_input">
                <span class="input-group-addon">值</span>
                <input type="text" class="form-control"
                placeholder="0x??" v-model="value">
            </div>
            <button :style="css_button" class="btn btn-default" @click="read_register">读寄存器</button>
            <button :style="css_button" class="btn btn-default" @click="write_register">写寄存器</button>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'width': '23em',
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
                'border-width': '0.5em',
            },
            css_button: {
                'margin': '0.5em 0.2em',
                'width': '6em',
                'display': 'inline-table',
                'padding': '6px',
            },
            css_input: {
                'display': 'inline-table',
                'width': '48%',
            },
            address: "",
            value: "",
        };
    };

    let methods = {
        read_register: function (e) {
            if (this.address === "") {
                $user_log("地址为空，读取失败", "danger");
            } else {
                this.value = "";
                $procedure.load("$gd32.read_register").exec(parseInt(this.address, 16));
            }
        },
        write_register: function (e) {
            if (this.address === "") {
                $user_log("地址为空，读取失败", "danger");
            } else {
                $procedure.load("$gd32.write_register")
                    .exec([parseInt(this.address, 16), parseInt(this.value, 16)]);
            }
        }
    };

    Vue.component('gd32_register', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            icc_define_icc("set_value", data => this.value = "0x" + data.value.toString(16).toUpperCase());
        }
    });
}

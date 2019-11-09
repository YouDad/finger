{
    let template = `
        <div class="dropdown">
            <button class="btn btn-default btn-block dropdown-toggle" data-toggle="dropdown">
                串口波特率: {{ baud }} <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" style="padding:0.25em;">
                <button class="btn btn-default btn-block"
                    v-for="(baud, index) in bauds" v-once @click="click_baud(index)">{{ baud }}</button>
            </ul>
        </div>
    `;

    let data = function () {
        return {
            baud: "57600",
            bauds: [921600, 460800, 230400, 115200, 57600, 9600],
        };
    };

    let methods = {
        click_baud: function (index) {
            this.baud = this.bauds[index];
        },
    };

    Vue.component('luwh_bauds', {
        template: template,
        data: data,
        methods: methods,
        created: function () {
            icc_define_icc("get_baud", baud => baud.baud = this.baud);
        },
    });
}

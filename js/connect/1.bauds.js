{
    let template = `
        <div class="dropdown">
            <button class="btn btn-default btn-block dropdown-toggle" data-toggle="dropdown">
                串口波特率: {{ now_baud }} <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" style="padding:0.25em;">
                <button class="btn btn-default btn-block"
                    v-for="baud in bauds" v-once @click="click_baud">{{ baud }}</button>
            </ul>
        </div>
    `;

    let data = function () {
        return {
            now_baud: "57600",
            bauds: [921600, 460800, 230400, 115200, 57600, 9600],
        };
    };

    let methods = {
        click_baud: function (e) {
            let that = this;
            that.now_baud = $(e.target).text();
        },
    };

    Vue.component('luwh_bauds', {
        template: template,
        data: data,
        methods: methods,
        created: function () {
            let that = this;
            $bus.$on("get_baud", function (data) {
                data.baud = that.now_baud;
            });
        },
    });
}

window.addEventListener('DOMContentLoaded', () => {
    let template = `
        <div class="dropdown">
            <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                串口波特率: {{ now_baud }} <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
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
            now_baud = $(e.target).text() + '<span class="caret"></span>';
        },
    };

    Vue.component('luwh_bauds', {
        template: template,
        data: data,
        methods: methods,
    });
});
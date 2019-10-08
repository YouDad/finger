window.addEventListener('DOMContentLoaded', () => {
    let template = `
        <div class="dropdown">
            <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                设备: {{ now_device }}<span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <button class="btn btn-default btn-block"
                    v-for="device in devices" @click="click_serial">{{ device }}</button>
            </ul>
        </div>
    `;

    let data = function () {
        return {
            now_device: "",
        };
    };

    let methods = {
        click_serial: function () {
            now_device = $(e.target).text() + '<span class="caret"></span>';
        },
    };

    Vue.component('luwh_devices', {
        template: template,
        data: data,
        methods: methods,
        props: ['devices'],
    });
});
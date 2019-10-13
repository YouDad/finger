{
    let template = `
        <div class="nav nav-pills nav-stacked">
            <luwh_bauds :style="css_luwh_bauds" v-show="show"></luwh_bauds>
            <luwh_devices :style="css_luwh_devices" v-show="show"></luwh_devices>

            <luwh_serial_connect :style="css_luwh_serial_connect" v-show="show"></luwh_serial_connect>

            <luwh_chdev_pwd :style="css_luwh_chdev_pwd" v-show="show"></luwh_chdev_pwd>
            <luwh_chdev_addr :style="css_luwh_chdev_addr" v-show="show"></luwh_chdev_addr>
        </div>
    `;

    let css = function () {
        return {
            css_luwh_bauds: {
                'padding': '0.25em',
                'width': '100%',
            },
            css_luwh_devices: {
                'padding': '0.25em',
                'width': '100%',
            },
            css_luwh_serial_connect: {
                'padding': '0.25em',
                'width': '100%',
                'margin-top': '2em',
            },
            css_luwh_chdev_pwd: {
                'padding': '0.25em',
                'width': '100%',
                'margin-top': '2em',
            },
            css_luwh_chdev_addr: {
                'padding': '0.25em',
                'width': '100%',
            },
            show: true,
        };
    };

    Vue.component('luwh_sidebar', {
        template: template,
        data: css,
    });
}

{
    let template = `
        <div :style="css_div">
            <luwh_bauds :style="css_luwh_bauds" v-show="show"></luwh_bauds>
            <luwh_devices :style="css_luwh_devices" v-show="show"></luwh_devices>

            <luwh_serial_connect :style="css_luwh_serial_connect" v-show="show"></luwh_serial_connect>
        </div>
    `;

    let css = function () {
        return {
            css_div: {
                'width': '21em',
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
                'display': 'inline-block',
            },
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

    Vue.component('luwh_connect', {
        template: template,
        data: css,
    });
}

{
    let template = `
        <div :style="css_div">
            <syno_bauds :style="css_syno_bauds" v-show="show"></syno_bauds>
            <syno_devices :style="css_syno_devices" v-show="show"></syno_devices>

            <syno_serial_connect :style="css_syno_serial_connect" v-show="show"></syno_serial_connect>
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
            css_syno_bauds: {
                'padding': '0.25em',
                'width': '100%',
            },
            css_syno_devices: {
                'padding': '0.25em',
                'width': '100%',
            },
            css_syno_serial_connect: {
                'padding': '0.25em',
                'width': '100%',
                'margin-top': '1em',
            },
            css_syno_chdev_pwd: {
                'padding': '0.25em',
                'width': '100%',
                'margin-top': '2em',
            },
            css_syno_chdev_addr: {
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

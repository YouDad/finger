{
    let template = `
        <div :style="css_div">
            <gd32_bauds :style="css_gd32_bauds" v-show="show"></gd32_bauds>
            <luwh_devices :style="css_luwh_devices" v-show="show"></luwh_devices>

            <gd32_serial_connect :style="css_gd32_serial_connect" v-show="show"></gd32_serial_connect>
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
            css_gd32_bauds: {
                'padding': '0.25em',
                'width': '100%',
            },
            css_luwh_devices: {
                'padding': '0.25em',
                'width': '100%',
            },
            css_gd32_serial_connect: {
                'padding': '0.25em',
                'width': '100%',
                'margin-top': '1em',
            },
            show: true,
        };
    };

    Vue.component('gd32_connect', {
        template: template,
        data: css,
    });
}

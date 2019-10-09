{
    let template = `
        <div :style="css_luwh_header">
            <luwh_links :style="css_luwh_links"></luwh_links>
            <luwh_bauds :style="css_luwh_bauds"></luwh_bauds>
            <luwh_devices :style="css_luwh_devices"></luwh_devices>
        </div>
    `;

    let css = function() {
        return {
            css_luwh_header: {
                position: 'relative',
            },

            css_luwh_links: {

            },

            css_luwh_bauds: {
                position: 'absolute',
                left: '10em',
                top: '0.2em',
            },

            css_luwh_devices: {
                position: 'absolute',
                left: '22em',
                top: '0.2em',
            },
        }
    };

    Vue.component('luwh_header', {
        template: template,
        data: css,
    });
}

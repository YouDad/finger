{
    let template = `
        <div :style="css_luwh_sidebar" class="nav nav-pills nav-stacked">
            <luwh_bauds></luwh_bauds>
            <luwh_devices></luwh_devices>

            <luwh_serial_connect></luwh_serial_connect>

            <luwh_chdev_pwd></luwh_chdev_pwd>
            <luwh_chdev_addr></luwh_chdev_addr>

            <luwh_side_toggler></luwh_side_toggler>
        </div>
    `;

    let data_css = function () {
        return {
            css_luwh_sidebar: {
                'position': 'absolute',
                'background': "#333",
                'width': "15em",
                'height': '100%',
            },
        }
    };

    let methods = {
        _: function () {
        },
    };
    Vue.component('luwh_sidebar', {
        template: template,
        data: data_css,
        methods: methods,
        mounted: function () {
            
        },
    });
}

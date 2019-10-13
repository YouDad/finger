{
    let template = `
        <div class="nav nav-pills nav-stacked">
            <luwh_bauds></luwh_bauds>
            <luwh_devices></luwh_devices>

            <luwh_serial_connect></luwh_serial_connect>

            <luwh_chdev_pwd></luwh_chdev_pwd>
            <luwh_chdev_addr></luwh_chdev_addr>

            <luwh_side_toggler></luwh_side_toggler>
        </div>
    `;

    Vue.component('luwh_sidebar', {
        template: template,
    });
}

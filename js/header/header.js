{
    let template = `
        <div :style="css_luwh_header">
            <luwh_links></luwh_links>
        </div>
    `;

    let css = function () {
        return {
            css_luwh_header: {
                'position': 'relative',
            },
        }
    };

    Vue.component('luwh_header', {
        template: template,
        data: css,
    });
}

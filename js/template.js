{
    let template = `
        <div :style="css_luwh_">
        </div>
    `;

    let data_css = function () {
        return {
            css_luwh_: {

            },
        }
    };

    let methods = {
        _: function () {
        },
    };
    Vue.component('luwh_', {
        template: template,
        data: data_css,
        methods: methods,
        mounted: function () {
            
        },
    });
}

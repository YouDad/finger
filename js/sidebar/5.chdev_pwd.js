{
    let template = `
        <div :style="css_luwh_">
        <button class="btn btn-default">luwh_chdev_pwd</button>
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

    Vue.component('luwh_chdev_pwd', {
        template: template,
        data: data_css,
        methods: methods,
        mounted: function () {
            
        },
    });
}

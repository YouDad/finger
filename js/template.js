{
    let template = `
        <div :style="css_luwh_">
        </div>
    `;

    let data_css = function () {
        return {
            css_luwh_: {
                '': '',
            },
        }
    };

    let methods = {
        _: function (e) {
            let that = this;
        },
        __: function () {

        },
    };
    Vue.component('luwh_', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {

        },
        mounted: function () {

        },
    });
}
{
    let template = `
        <div :style="css_luwh_other">
            <button class="btn btn-default" @click="get_random">获取随机数</button>
        </div>
    `;

    let data_css = function () {
        return {
            css_luwh_other: {
                '': '',
            },
        }
    };

    let methods = {
        get_random: function (e) {
            let that = this;
            $procedure.load("$syno.get_random").exec();
        },
    };
    Vue.component('luwh_other', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {

        },
        mounted: function () {

        },
    });
}

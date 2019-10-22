{
    let template = `
        <div :style="css_div">
            <button :style="css_random" class="btn btn-default" @click="get_random">获取随机数</button>
            <luwh_notepad></luwh_notepad>
            <luwh_leds :style="css_leds"></luwh_leds>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'width': '21em',
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
            },
            css_random: {
                'display': 'inline-table',
            },
            css_leds: {
                'margin-top': '0.5em',
                'margin-bottom': '0.5em',
            },
        }
    };

    let methods = {
        get_random: function (e) {
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

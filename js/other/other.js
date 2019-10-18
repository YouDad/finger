{
    let template = `
        <div :style="css_div">
            <button class="btn btn-default" @click="get_random">获取随机数</button>
            <button class="btn btn-warning" style="margin-left: 1em;" @click="cancel">取消指令执行</button>
            <luwh_leds :style="css_leds"></luwh_leds>
            <luwh_notepad></luwh_notepad>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'width': '21em',
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
            },
            css_leds: {
                'margin-top': '0.5em',
                'margin-bottom': '0.5em',
            },
        }
    };

    let methods = {
        get_random: function (e) {
            let that = this;
            $procedure.load("$syno.get_random").exec();
        },
        cancel: function (e) {
            $procedure.load("$syno.cancel");
            // TODO: cancel
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
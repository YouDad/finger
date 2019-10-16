{
    let template = `
        <div :style="css_div">
            <button class="btn btn-danger" @click="emptychar">清空指纹库</button>
            <button class="btn btn-success" @click="validchar">获得有效指纹列表</button>
            <button class="btn btn-danger" @click="delchar">删除指纹</button>
            <luwh_finger_map></luwh_finger_map>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'width': '21em',
                'padding': '1em',
                'border-radius': '0.5em',
                'border': '0.5em solid rgb(217, 237, 247)',
            },
        }
    };

    let methods = {
        emptychar: function (e) {
            let that = this;
            $procedure.load("$syno.emptychar").exec();
        },
        validchar: function (e) {
            let that = this;
            $procedure.load("$syno.validchar").exec();
        },
        delchar: function (e) {
            let that = this;
            $procedure.load("$syno.delchar").exec();
        },
    };

    Vue.component('luwh_character', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {

        },
        mounted: function () {

        },
    });
}

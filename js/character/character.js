{
    let template = `
        <div :style="css_div">
            <button :style="css_empty" class="btn btn-danger" @click="emptychar">清空指纹库</button>
            <button :style="css_valid" class="btn btn-default" @click="validchar">指纹列表</button>
            <button :style="css_delete" class="btn btn-danger" @click="delchar">删除指纹</button>
            <luwh_finger_map :style="css_map"></luwh_finger_map>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'width': '23em',
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
            },
            css_empty: {
                
            },
            css_valid: {
                'margin-left': '0.4em',
            },
            css_delete: {
                'margin-left': '0.4em',
            },
            css_map: {
                'margin-top': '0.5em',
            }
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

{
    let template = `
        <div :style="css_div">
            <button :style="css_empty" class="btn btn-danger" @click="emptychar">清空指纹库</button>
            <button :style="css_valid" class="btn btn-default" @click="validchar">指纹列表</button>
            <button :style="css_delete" class="btn btn-danger" @click="delchar">删除指纹</button>
            <button :style="css_downimage" class="btn btn-default" @click="delchar">下载图像</button>
            <button :style="css_upchar" class="btn btn-default" @click="delchar">上传指纹</button>
            <button :style="css_downchar" class="btn btn-default" @click="delchar">下载指纹</button>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'margin-top': '1em',
            },
            css_empty: {
                'width': '6em',
                'padding': '6px',
            },
            css_valid: {
                'margin-left': '0.4em',
            },
            css_delete: {
                'margin-left': '0.4em',
            },
            css_downimage: {
                'margin-top': '1em',
            },
            css_upchar: {
                'margin-top': '1em',
            },
            css_downchar: {
                'margin-top': '1em',
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

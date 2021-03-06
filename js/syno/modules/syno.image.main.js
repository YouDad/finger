{
    let template = `
        <div :style="css_div">
            <img :src="image_src" :style="css_img"/>
            <label class="hint--top" aria-label="在上传图像后将图像保存到文件中">
                <input type="checkbox" v-model="receive_image">
                上传并保存图像
            </label>
            <button class="btn btn-default" style="margin-left: 0.5em" @click="icc_open_explorer">打开图像文件夹</button>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
            },
            css_img: {
                'width': '18em',
                'height': '18em',
            },
            receive_image: false,
            image_src: "data:image/png;base64,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",
        }
    };

    let methods = {
        icc_open_explorer: function () {
            icc_open_explorer();
        },
    };

    Vue.component('syno_image', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            icc_define_icc("show_image", async result => {
                this.image_src = await icc_convert_image(result);
            });
            icc_define_icc("is_receive_image", result => result.is_receive_image = this.receive_image);
            icc_define_icc("is_save_image", result => result.is_save_image = this.receive_image);
        },
    });
}

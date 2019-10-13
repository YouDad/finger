{
    let template = `
        <div>
            <button class="btn btn-default btn-block" @click="get_image">获取图像</button>
        </div>
    `;

    let methods = {
        get_image: async function (e) {
            let that = this;
            await $procedure.load("$syno.get_image").exec();
        },
    };
    Vue.component('luwh_get_image', {
        template: template,
        methods: methods,
    });
}

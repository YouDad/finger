{
    let template = `
        <div>
            <button class="btn btn-default btn-block" @click="search">搜索</button>
        </div>
    `;

    let methods = {
        search: async function (e) {
            let that = this;
            await $procedure.load("$syno.search").exec();
        },
    };
    Vue.component('luwh_search', {
        template: template,
        methods: methods,
    });
}

{
    let template = `
        <div>
            <button class="btn btn-default" @click="match">比对</button>
        </div>
    `;

    let methods = {
        match: async function (e) {
            let that = this;
            await $procedure.load("$syno.match").exec();
        },
    };
    Vue.component('luwh_match', {
        template: template,
        methods: methods,
    });
}

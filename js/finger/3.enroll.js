{
    let template = `
        <div>
            <button class="btn btn-default btn-block" @click="enroll">注册</button>
        </div>
    `;

    let methods = {
        enroll: async function (e) {
            let that = this;
            await $procedure.load("$syno.enroll").exec();
        },
    };

    Vue.component('luwh_enroll', {
        template: template,
        methods: methods,
    });
}

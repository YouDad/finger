{
    let template = `
        <div>
            <div class="input-group">
                <span class="input-group-addon" id="basic-addon1">finger_id</span>
                <input type="text" class="form-control" placeholder="finger_id" v-model="finger_id"/>
            </div>
            <button class="btn btn-default" @click="enroll">注册</button>
        </div>
    `;

    let data = function () {
        return {
            finger_id: 0,
        };
    };

    let methods = {
        enroll: async function (e) {
            let that = this;
            await $procedure.load("$syno.enroll").exec();
        },
    };
    Vue.component('luwh_enroll', {
        template: template,
        data: data,
        methods: methods,
        created: function () {
            let that = this;
            $bus.$on("get_finger_id", function (finger_id) {
                finger_id.finger_id = that.finger_id;
            });
        },
    });
}

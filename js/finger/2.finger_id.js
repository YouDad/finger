{
    let template = `
        <div>
            <div class="input-group">
                <span class="input-group-addon" id="basic-addon1">finger_id</span>
                <input type="text" class="form-control" placeholder="finger_id" v-model="finger_id"/>
            </div>
        </div>
    `;

    let data = function () {
        return {
            finger_id: 0,
        };
    };

    Vue.component('luwh_finger_id', {
        template: template,
        data: data,
        created: function () {
            let that = this;
            $bus.$on("get_finger_id", function (finger_id) {
                finger_id.finger_id = that.finger_id;
            });
        },
    });
}

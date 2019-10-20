{
    let template = `
        <div :style="css_div">
            <button :style="css_luwh_get_image" class="btn btn-default" @click="get_image">获取图像</button>
            <div class="input-group" :style="css_luwh_finger_id">
                <span class="input-group-addon">指纹ID</span>
                <input type="text" class="form-control" placeholder="finger_id" v-model="finger_id"/>
            </div>
            <button :style="css_button" class="btn btn-default" @click="enroll">注册</button>
            <button :style="css_button" class="btn btn-default" @click="match">比对</button>
            <button :style="css_button" class="btn btn-default" @click="search">搜索</button>
            <button :style="css_button" class="btn btn-default" @click="continue_get_image">连续采图</button>
            <button :style="css_button" class="btn btn-default" @click="continue_match">连续比对</button>
            <button :style="css_button" class="btn btn-default" @click="continue_search">连续搜索</button>
            <button :style="css_button" class="btn btn-danger"  @click="emptychar">清空指纹库</button>
            <button :style="css_button" class="btn btn-danger"  @click="delchar">删除指纹</button>
            <button :style="css_button" class="btn btn-warning" @click="cancel">取消指令</button>
            <button :style="css_button" class="btn btn-default" @click="delchar">下载图像</button>
            <button :style="css_button" class="btn btn-default" @click="delchar">上传指纹</button>
            <button :style="css_button" class="btn btn-default" @click="delchar">下载指纹</button>
            <luwh_finger_map :style="css_map"></luwh_finger_map>
        </div>
    `;



    let data_css = function () {
        return {
            css_div: {
                'width': '23em',
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
                'border-width': '0.5em',
            },
            css_luwh_get_image: {
                'margin': '-1.3em 0.2em 0.5em',
                'width': '6em',
                'display': 'inline-table',
            },
            css_luwh_finger_id: {
                'margin': '0.5em 0.15em',
                'width': '13em',
                'display': 'inline-table',
            },
            css_button: {
                'margin': '0.5em 0.2em',
                'width': '6em',
                'display': 'inline-table',
                'padding': '6px',
            },
            css_map: {
                'margin-top': '0.5em',
            },
            finger_id: 0,
        };
    };

    let methods = {
        get_image: function (e) {
            let that = this;
            $procedure.load("$syno.get_image").exec();
        },
        enroll: function (e) {
            let that = this;
            $procedure.load("$syno.enroll").exec();
        },
        match: function (e) {
            let that = this;
            $procedure.load("$syno.match").exec();
        },
        search: function (e) {
            let that = this;
            $procedure.load("$syno.search").exec();
        },
        continue_get_image: function (e) {
            let that = this;
            $procedure.load("$syno.get_image").exec(true);
        },
        continue_match: function (e) {
            let that = this;
            $procedure.load("$syno.match").exec(true);
        },
        continue_search: function (e) {
            let that = this;
            $procedure.load("$syno.search").exec(true);
        },
        emptychar: function (e) {
            let that = this;
            $procedure.load("$syno.emptychar").exec();
        },
        validchar: function (e) {
            let that = this;
            $procedure.load("$syno.validchar").exec();
        },
        cancel: function (e) {
            $procedure.load("$syno.cancel");
            // TODO: cancel
        },
        delchar: function (e) {
            let that = this;
            $procedure.load("$syno.delchar").exec();
        },
    };

    Vue.component('luwh_finger', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            $bus.$on("get_finger_id", (finger_id) => finger_id.finger_id = that.finger_id);
            $bus.$on("set_finger_id", (finger_id) => that.finger_id = finger_id.finger_id);
        },
    });
}

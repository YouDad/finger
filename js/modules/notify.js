{
    let template = `
        <div>
            <transition-group name="slide-fade">
                <div class="modal fade show" style="opacity: 1" v-for="(text, index) in notify_text" :key="index+text">
                    <div class="modal-dialog">
                        <div class="alert" :class="css_alert[index]">{{text}}</div>
                    </div>
                </div>
            </transition-group>
        </div>
    `;

    let data_css = function () {
        return {
            css_alert: {},
            notify_text: {},
            next_id: 0,
        }
    };

    Vue.component('luwh_notify', {
        template: template,
        data: data_css,
        created: function () {
            let that = this;
            function notify(_text, _class) {
                let text_id = that.next_id++;
                that.$set(that.notify_text, text_id, _text);
                that.$set(that.css_alert, text_id, _class);
                let id = setInterval(() => {
                    clearInterval(id);
                    that.$delete(that.css_alert, text_id);
                    that.$delete(that.notify_text, text_id);
                }, 2000);
            }
            $bus.$on("notify.success", text => notify(text, "alert-success"));
            $bus.$on("notify.info", text => notify(text, "alert-info"));
            $bus.$on("notify.warning", text => notify(text, "alert-warning"));
            $bus.$on("notify.danger", text => notify(text, "alert-danger"));
        },
    });
}

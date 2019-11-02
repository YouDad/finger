{
    let template = `
        <div>
            <transition-group name="slide-fade">
                <div class="modal-dialog fade show" style="opacity: 0.7; z-index: 1050; margin: 0 auto;" v-for="(text, index) in notify_text" :key="index+text">
                    <div class="alert" style="margin-bottom: 0;" :class="css_alert[index]">{{text}}</div>
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

    Vue.component('syno_notify', {
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
                }, 1500);
            }
            icc_define_icc("notify.success", text => notify(text, "alert-success"));
            icc_define_icc("notify.info", text => notify(text, "alert-info"));
            icc_define_icc("notify.warning", text => notify(text, "alert-warning"));
            icc_define_icc("notify.danger", text => notify(text, "alert-danger"));
        },
    });
}

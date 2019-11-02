{
    let template = `
        <div :style="css_div">
            <div class="btn-group" :style="css_nav">
                <button type="button" class="btn btn-success" @click="log_type=0;">用户</button>
                <button type="button" class="btn btn-warning" @click="log_type=1;">串口</button>
                <button type="button" class="btn btn-danger" @click="log_type=2;">开发者</button>
            </div>
            <ul class="list-group" :style="css_list_limited" v-show="log_type==0">
                    <li class="list-group-item" :class="log.type" v-for="(log, index) in user_logs">
                        {{log.message}}
                        <span :key="log.message+index" class="badge">{{now}} {{log.number}}</span>
                    </li>
            </ul>
            <ul class="list-group" :style="css_list_limited" v-show="log_type==1">
                    <li class="list-group-item" :class="log.type" v-for="(log, index) in test_logs">
                        {{log.message}}
                        <span :key="log.message+index" class="badge">{{now}} {{log.number}}</span>
                    </li>
            </ul>
            <ul class="list-group" :style="css_list_limited" v-show="log_type==2">
                    <li class="list-group-item" :class="log.type" v-for="(log, index) in deve_logs">
                        {{log.message}}
                        <span :key="log.message+index" class="badge">{{now}} {{log.number}}</span>
                    </li>
            </ul>
        </div>
    `;

    let data_css = function () {
        return {
            css_list_limited: {
                'height': '13.5em',
                'overflow': 'auto',
                'border': '0.5em solid #d9edf7',
            },
            css_div: {
                'width': '50em',
                'padding': '1em',
                '-webkit-user-select': 'text',
            },
            css_nav: {
                'border': '0.5em solid #d9edf7',
                'margin-left': '36.57em',
            },
            process_type: "progress-bar-info",
            log_type: 0,
            user_logs: [],
            test_logs: [],
            deve_logs: [],
        }
    };

    let computed = {
        now: () => {
            return (new Date()).toString().split(" ")[4];
        },
    };

    Vue.component('luwh_log', {
        template: template,
        data: data_css,
        computed: computed,
        created: function () {
            let that = this;
            icc_define_icc("log", function (log) {
                let logs;
                switch (log.type) {
                    case "info":
                    case "warning":
                    case "danger":
                    case "success":
                        break;
                    default:
                        console.error("log type error " + log.type);
                        return;
                }
                that.process_type = "progress-bar-" + log.type;
                switch (log.level) {
                    case 0: logs = that.user_logs; break;
                    case 1: logs = that.test_logs; break;
                    case 2: logs = that.deve_logs; break;
                }
                log.type = "list-group-item-" + log.type;

                if (log.message) {
                    if (logs.length > 0 && log.message == logs[logs.length - 1].message) {
                        logs[logs.length - 1].number++;
                    } else {
                        log.number = 1;
                        logs.push(log);
                    }
                }
            });
        },
        mounted: function () {
            $(".list-group").bind("DOMNodeInserted", function (e) {
                e.currentTarget.scrollTop = e.currentTarget.scrollHeight;
            });
        },
    });
}

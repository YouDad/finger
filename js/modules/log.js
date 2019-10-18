{
    let template = `
        <div :style="css_div">
            <div class="btn-group" :style="css_nav">
                <button type="button" class="btn btn-success" @click="log_type=0;">用户</button>
                <button type="button" class="btn btn-warning" @click="log_type=1;">测试</button>
                <button type="button" class="btn btn-danger" @click="log_type=2;">开发者</button>
            </div>
            <ul class="list-group" :style="css_list_limited" v-show="log_type==0">
                <li class="list-group-item" :class="log.type" v-for="log in user_logs">{{log.message}}<span class="badge">{{now}} {{log.number}}</span></li>
            </ul>
            <ul class="list-group" :style="css_list_limited" v-show="log_type==1">
                <li class="list-group-item" :class="log.type" v-for="log in test_logs">{{log.message}}<span class="badge">{{now}} {{log.number}}</span></li>
            </ul>
            <ul class="list-group" :style="css_list_limited" v-show="log_type==2">
                <li class="list-group-item" :class="log.type" v-for="log in deve_logs">{{log.message}}<span class="badge">{{now}} {{log.number}}</span></li>
            </ul>
            <!--<div class="progress">
                <div class="progress-bar progress-bar-striped active" :class="process_type" role="progressbar" :style="css_process">
                    <span class="sr-only">45% Complete</span>
                </div>
            </div>-->
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
            },
            css_nav: {
                'border': '0.5em solid #d9edf7',
            },
            process_type: "progress-bar-info",
            log_type: 0,
            css_process: {
                'width': '0%'
            },
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
            $bus.$on("log", function (log) {
                // if (log.process) {
                //     that.css_process.width = log.process * 100 + "%";
                //     return;
                // }

                let logs;
                if (!log.type) {
                    log.type = "info";
                }
                switch (log.type) {
                    case "info": log.type = "info"; break;
                    case "warn": log.type = "warning"; break;
                    case "error": log.type = "danger"; break;
                    case "success": log.type = "success"; break;
                }
                switch (log.level) {
                    case 0: logs = that.user_logs; that.process_type = "progress-bar-" + log.type; break;
                    case 1: logs = that.test_logs; break;
                    case 2: logs = that.deve_logs; break;
                }
                log.type = "list-group-item-" + log.type;

                if (log.message) {
                    if (logs.length > 0 && log.message == logs[logs.length - 1].message) {
                        logs[logs.length - 1].number++;
                    } else {
                        log.number = 0;
                        logs.push(log);
                    }
                }
            });
        },
        mounted: function () {
            $(".list-group").bind("DOMNodeInserted", function (e) {
                e.currentTarget.scrollTop = e.currentTarget.scrollHeight
            })
        },
    });

    function $user_log(message, type) {
        $bus.$emit("log", {
            message: message,
            type: type,
            level: 0,
        });
        if (message) {
            $bus.$emit("log", {
                message: message,
                type: type,
                level: 1,
            });
            $bus.$emit("log", {
                message: message,
                type: type,
                level: 2,
            });
        }
    }

    function $test_log(message, type) {
        $bus.$emit("log", {
            message: message,
            type: type,
            level: 1,
        });
        if (message) {
            $bus.$emit("log", {
                message: message,
                type: type,
                level: 2,
            });
        }
    }

    function $log(message, type) {
        $bus.$emit("log", {
            message: message,
            type: type,
            level: 2,
        });
    }

    function $process(process) {
        return;
        $bus.$emit("log", {
            process: process,
        });
    }
}
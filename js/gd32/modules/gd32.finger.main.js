{
    let template = `
        <div :style="css_div">
            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$gd32.get_image')">原始图像</button>
            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$gd32.get_image', true)">连续原始</button>
            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$gd32.test_image')">测试图像</button>
            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$gd32.test_image', true)">连续测试</button>
            <button :style="css_button" class="btn btn-warning" @click="exec_procedure('$syno.cancel')">取消指令</button>
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
            css_button: {
                'margin': '0.5em 0.2em',
                'width': '6em',
                'display': 'inline-table',
                'padding': '6px',
            },
        };
    };

    let methods = {
        exec_procedure: function (name, continued) {
            if (continued === undefined) {
                $procedure.load(name).exec();
            } else {
                $procedure.load(name).exec(continued);
            }
        },
    };

    Vue.component('gd32_finger', {
        template: template,
        data: data_css,
        methods: methods,
    });
}

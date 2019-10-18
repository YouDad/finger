{
    let template = `
        <div :style="css_div">
            <div class="btn-group">
                <button v-for="(led, i) in leds" @click="btn_click(i)"
                    class="btn" :class="{'btn-default':!led,'btn-success':led}">LED{{i}}</button>
            </div>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {

            },
            leds: [false, false, false, false],
        }
    };

    let methods = {
        btn_click: function (i) {
            this.$set(this.leds, i, !this.leds[i]);
        },
    };

    let watch = {
        leds: function (newValue) {
            $procedure.load("$syno.leds").exec(newValue);
        }
    };

    Vue.component('luwh_leds', {
        template: template,
        data: data_css,
        methods: methods,
        watch: watch,
        created: function () {

        },
        mounted: function () {

        },
    });
}

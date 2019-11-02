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
            backup: null,
        }
    };

    let methods = {
        btn_click: function (i) {
            this.backup=this.leds;
            this.$set(this.leds, i, !this.leds[i]);
        },
    };

    let watch = {
        leds: function (newValue) {
            $procedure.load("$syno.leds").exec(newValue);
        }
    };

    Vue.component('syno_leds', {
        template: template,
        data: data_css,
        methods: methods,
        watch: watch,
        created: function () {
            icc_define_icc("leds_back", ()=>this.leds=this.backup);
        },
        mounted: function () {

        },
    });
}

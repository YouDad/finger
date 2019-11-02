{
    let template = `
        <div :style="css_div">
            <div class="btn-group" :style="css_nav" v-show="items.length!==0">
                <button class="btn btn-default" v-for="i in range(3)"
                    :style="css_nav_button" @click="nav_click(i)">
                    {{nav_text(i)}}</button>
            </div>
            <template v-for="base in range(items.length/16)">
                <div :style="css_line" v-show="show(base)">
                    <button class="btn hint--top" v-for="(item, index) in items.slice(base*16+0,base*16+8)"
                    :aria-label="tooltip(base*16+0+index, item)" @click="icc_set_finger_id(base*16+0+index)"
                    :class="{'btn-primary':item!=0,'btn-default':item==0}" :style="css_button"></button>
                </div>
                <div :style="css_after" v-show="show(base)">
                    <button class="btn hint--top" v-for="(item, index) in items.slice(base*16+8,base*16+16)"
                    :aria-label="tooltip(base*16+8+index, item)" @click="icc_set_finger_id(base*16+8+index)"
                    :class="{'btn-primary':item!=0,'btn-default':item==0}" :style="css_button"></button>
                </div>
            </template>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {

            },
            css_after: {
                'margin': '-1.4142em 0 0 10.5em',
                'position': 'absolute',
            },
            css_line: {

            },
            css_button: {
                'padding': '0.48em',
                'margin': '0.06em',
            },
            css_nav_button: {
                'width': '2.5em',
                'height': '2.5em',
            },
            css_nav: {
                'margin-bottom': '0.5em',
                'margin-left': '12.6em',
            },
            items: [],
            BitSize: 129,
            NowPage: 0,
        }
    };

    let methods = {
        tooltip: function (index, item) {
            if (item == 0) {
                return `${index}没有指纹`;
            } else {
                return `${index}有指纹`;
            }
        },
        show: function (base) {
            base = -Math.floor(base / 4) + this.NowPage;
            return (base % this.MaxPage + this.MaxPage) % this.MaxPage == 0;
        },
        nav_text: function (offset) {
            if (this.NowPage + offset <= 0 || this.NowPage + offset > this.MaxPage) {
                return "";
            } else {
                return this.NowPage + offset;
            }
        },
        nav_click: function (offset) {
            if (this.NowPage + offset <= 0 || this.NowPage + offset > this.MaxPage) {
                return "";
            } else {
                return this.NowPage += offset - 1;
            }
        },
        range: function (start, end) {
            if (end === undefined) {
                end = start;
                start = 0;
            }
            let ret = [];
            for (let i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        },
    };

    let computed = {
        MaxPage: function () {
            return Math.ceil(this.items.length / 64);
        },
    };

    Vue.component('syno_finger_map', {
        template, computed, methods,
        data: data_css,
        created: function () {
        },
        mounted: function () {
            let that = this;
            icc_define_icc("set_map", arr => that.items = arr);
        },
    });
}

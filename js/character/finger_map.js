{
    let template = `
        <div :style="css_div">
            <div :style="css_line">
                <button class="btn" v-for="(item, index) in items.slice(0,8)"
                :class="{'btn-primary':item==1,'btn-default':item==0}" :style="css_button"></button>
            </div>
            <div :style="css_after">
                <button class="btn" v-for="(item, index) in items.slice(8,16)"
                :class="{'btn-primary':item==1,'btn-default':item==0}" :style="css_button"></button>
            </div>
            
            <div :style="css_line">
                <button class="btn" v-for="(item, index) in items.slice(16,24)"
                :class="{'btn-primary':item==1,'btn-default':item==0}" :style="css_button"></button>
            </div>
            <div :style="css_after">
                <button class="btn" v-for="(item, index) in items.slice(24,32)"
                :class="{'btn-primary':item==1,'btn-default':item==0}" :style="css_button"></button>
            </div>
            
            <div :style="css_line">
                <button class="btn" v-for="(item, index) in items.slice(32,40)"
                :class="{'btn-primary':item==1,'btn-default':item==0}" :style="css_button"></button>
            </div>
            <div :style="css_after">
                <button class="btn" v-for="(item, index) in items.slice(40,48)"
                :class="{'btn-primary':item==1,'btn-default':item==0}" :style="css_button"></button>
            </div>
            
            <div :style="css_line">
                <button class="btn" v-for="(item, index) in items.slice(48,56)"
                :class="{'btn-primary':item==1,'btn-default':item==0}" :style="css_button"></button>
            </div>
            <div :style="css_after">
                <button class="btn" v-for="(item, index) in items.slice(56,64)"
                :class="{'btn-primary':item==1,'btn-default':item==0}" :style="css_button"></button>
            </div>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'padding': '0.5em',

            },
            css_after: {
                'margin': '-1.069em 0 0 9em',
                'position': 'absolute',
            },
            css_line: {
                'margin': '-0.35em 0',
            },
            css_button: {
                'padding': '0.38em',
                'margin': '0.06em',
            },
            items: Array(64),
        }
    };

    let methods = {
    };

    Vue.component('luwh_finger_map', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            for (let i = 0; i < 64; i++) {
                this.items[i] = 1;
            }
        },
        mounted: function () {

        },
    });
}

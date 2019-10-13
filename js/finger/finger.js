{
    let template = `
        <div :style="css_div">
            <luwh_get_image :style="css_luwh_get_image"></luwh_get_image>
            <luwh_finger_id :style="css_luwh_finger_id"></luwh_finger_id>
            <luwh_enroll :style="css_luwh_enroll"></luwh_enroll>
            <luwh_match :style="css_luwh_match"></luwh_match>
            <luwh_search :style="css_luwh_search"></luwh_search>
        </div>
    `;

    let css = function () {
        return {
            css_luwh_get_image: {
                'position': 'absolute',
                'margin-left': '0em',
                'width': '6em',
            },
            css_luwh_finger_id: {
                'position': 'absolute',
                'margin-left': '7em',
                'width': '13em',
            },
            css_luwh_enroll: {
                'position': 'absolute',
                'margin-left': '0em',
                'width': '6em',
                'margin-top': '3.5em',
            },
            css_luwh_match: {
                'position': 'absolute',
                'margin-left': '7em',
                'width': '6em',
                'margin-top': '3.5em',
            },
            css_luwh_search: {
                // 'position': 'absolute',
                'margin-left': '14em',
                'width': '6em',
                'margin-top': '3.5em',
            },
            css_div: {
                'width': '23em',
                'padding': '1em',
                'border-radius': '0.5em',
                'border': '1em solid #d9edf7',
                'border-width': '0.5em',
            },
        };
    };

    Vue.component('luwh_finger', {
        template: template,
        data: css,
    });
}

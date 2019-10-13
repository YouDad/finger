{
    let template = `
        <div>
            <luwh_get_image></luwh_get_image>
            <luwh_enroll></luwh_enroll>
            <luwh_match></luwh_match>
            <luwh_search></luwh_search>
        </div>
    `;

    Vue.component('luwh_finger', {
        template: template,
    });
}

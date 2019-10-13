{
    let template = `
        <div :style="css_div">
            <ul class="list-group" :style="css_list_limited">
                <li class="list-group-item list-group-item-success">
                    <span class="badge">14</span>
                    Dapibus ac facilisis in
                </li>
                <li class="list-group-item list-group-item-info">Cras sit amet nibh libero</li>
                <li class="list-group-item list-group-item-warning">Porta ac consectetur ac</li>
                <li class="list-group-item list-group-item-danger">Vestibulum at eros</li>
            </ul>
            <div class="progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%">
                    <span class="sr-only">45% Complete</span>
                </div>
            </div>
        </div>
    `;

    let data_css = function () {
        return {
            css_list_limited: {
                'max-height': '10em',
                'overflow': 'auto',
            },
            css_div: {
                'width': '50em',
                'padding': '1em',
                'border-radius': '0.5em',
                'border': '1em solid #d9edf7',
                'border-width': '0.5em',
            },
        }
    };

    let methods = {

    };

    Vue.component('luwh_log', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {

        },
        mounted: function () {

        },
    });
}

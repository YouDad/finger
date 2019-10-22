{
    let template = `
        <ul class="nav nav-tabs">
            <li :class="syno_style()">
                <a href="#">Syno</a>
            </li>
            <li :class="gd32_style()">
                <a href="#">GD32</a>
            </li>
        </ul>
    `;

    let methods = {
        syno_style: function () {
            let filename = window.location.pathname.split("/").pop();
            filename = filename.toLowerCase();
            if (filename == "syno.html") {
                return "active";
            } else {
                return "";
            }
        },
        gd32_style: function () {
            let filename = window.location.pathname.split("/").pop();
            filename = filename.toLowerCase();
            if (filename == "gd32.html") {
                return "active";
            } else {
                return "";
            }
        }
    };

    Vue.component('luwh_header', {
        template: template,
        methods: methods,
    });
}

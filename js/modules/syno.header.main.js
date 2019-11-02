{
    let template = `
        <ul class="nav nav-tabs">
            <li :class="syno_style()">
                <a href="#" @click="click('Syno')">Syno</a>
            </li>
            <li :class="gd32_style()">
                <a href="#" @click="click('GD32')">GD32</a>
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
        },
        click: function (type) {
            if (type == "GD32") {
                let filename = window.location.pathname.split("/").pop();
                filename = filename.toLowerCase();
                if (filename != "gd32.html") {
                    // window.location.href = path_join(__project, "html", "gd32.html");
                }
            } else {
                let filename = window.location.pathname.split("/").pop();
                filename = filename.toLowerCase();
                if (filename != "syno.html") {
                    window.location.href = path_join(__project, "html", "syno.html");
                }
            }
        }
    };

    Vue.component('syno_header', {
        template: template,
        methods: methods,
    });
}

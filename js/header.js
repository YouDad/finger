window.addEventListener('DOMContentLoaded', () => {
    let template = `
        <ul id="header" class="nav nav-tabs">
            <link rel="stylesheet" href="../css/main.css">
            <li id="syno">
                <a href="syno.html">Syno</a>
            </li>
            <li id="gd32">
                <a href="gd32.html">GD32</a>
            </li>
            <li>
                <luwh_bauds></luwh_bauds>
            </li>
            <li>
                <luwh_devices :devices="x"></luwh_devices>
            </li>
            <li>
                <button class="btn btn-primary" @click="flash_serial">刷新串口列表</button>
            </li>
        </ul>
    `;

    let data = function () {
        return {
            x: [],
        };
    };

    let methods = {
        flash_serial: function () {
            serial.list(function (err, ports) {
                ports.forEach(function (port) {
                    console.log(port);
                    if (port.comName != undefined &&
                        port.pnpId != undefined &&
                        port.manufacturer != undefined) {
                        x.push(port.comName);
                    }
                });
            });
        },
    };
    Vue.component('luwh_header', {
        template: template,
        data: data,
        methods: methods,
        mounted: function () {
            let filename = window.location.pathname.split("/").pop();
            filename = filename.toLowerCase();
            if (filename == "syno.html") {
                $("#syno").addClass("active");
                $("#gd32").removeClass("active");
            }
            if (filename == "gd32.html") {
                $("#gd32").addClass("active");
                $("#syno").removeClass("active");
            }
        },
    });
});
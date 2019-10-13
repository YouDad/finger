{
    let template = `
        <ul class="nav nav-tabs">
            <li id="syno">
                <a href="syno.html">Syno</a>
            </li>
            <li id="gd32">
                <a href="gd32.html">GD32</a>
            </li>
        </ul>
    `;

    Vue.component('luwh_header', {
        template: template,
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
}

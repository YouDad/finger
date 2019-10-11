window.event_bus = new Vue();
window.$bus = {
    request: function (cmd, data) {
        window.event_bus.$emit(cmd, data);
    },
    response: function (cmd, func) {
        window.event_bus.$on(cmd, func);
    },
};

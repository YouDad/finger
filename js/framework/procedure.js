window.$procedure = {
    procedures: {},
    now_step: "",
    now_procedure: null,
    define: function (name, name_func_map) {
        this.procedures[name] = name_func_map;
        return $procedure;
    },
    load: function (name, start_step = "begin") {
        if (!name || !this.procedures[name]) {
            $log(`load procedure ${name} failed. because no such procedure.`, "error");
            return;
        }
        if (!start_step || !this.procedures[name][start_step]) {
            $log(`load procedure ${name} failed. because no start_step:${start_step}.`, "error");
            return;
        }

        this.now_step = start_step;
        this.now_procedure = this.procedures[name];
        return $procedure;
    },
    kill: function () {
        if (this.now_procedure == null) {
            $log("kill procedure failed. now_procedure is null.", "warn");
        }

        this.now_procedure = null;
        return $procedure;
    },
    exec: async function (data) {
        if (!this.now_procedure) {
            $log("exec procedure failed. because no availiable procedure.", "error");
            return;
        }
        if (!this.now_procedure[this.now_step]) {
            $log(`next procedure failed. ${this.now_procedure}["${this.now_step}"] is null, cannot be called.`, "warn");
        }

        await this.now_procedure[this.now_step](data);
        return $procedure;
    },
    next: function (step) {
        if (!this.now_procedure) {
            $log("next procedure failed. because no availiable procedure.", "error");
            return;
        }
        if (!this.now_procedure[step]) {
            $log(`next procedure failed. ${this.now_procedure}["${step}"] is null, cannot be called.`, "warn");
        }

        this.now_step = step;
        return $procedure;
    }
};

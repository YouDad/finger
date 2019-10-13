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
            console.error(`load procedure ${name} failed. because no such procedure.`);
            return;
        }
        if (!start_step || !this.procedures[name][start_step]) {
            console.error(`load procedure ${name} failed. because no start_step:${start_step}.`);
            return;
        }

        this.now_step = start_step;
        this.now_procedure = this.procedures[name];
        return $procedure;
    },
    kill: function () {
        if (this.now_procedure == null) {
            console.warn("kill procedure failed. now_procedure is null.");
        }

        this.now_procedure = null;
        return $procedure;
    },
    exec: async function (data) {
        if (!this.now_procedure) {
            console.error("exec procedure failed. because no availiable procedure.");
            return;
        }
        if (!this.now_procedure[this.now_step]) {
            console.warn(`next procedure failed. ${this.now_procedure}["${this.now_step}"] is null, cannot be called.`);
        }

        await this.now_procedure[this.now_step](data);
        return $procedure;
    },
    next: function (step) {
        if (!this.now_procedure) {
            console.error("next procedure failed. because no availiable procedure.");
            return;
        }
        if (!this.now_procedure[step]) {
            console.warn(`next procedure failed. ${this.now_procedure}["${step}"] is null, cannot be called.`);
        }

        this.now_step = step;
        return $procedure;
    }
};

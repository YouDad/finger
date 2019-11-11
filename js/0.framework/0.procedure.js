window.$procedure = {
    procedures: {},
    now_step: "",
    now_procedure: null,
    work_queue: [],
    define: function (name, name_func_map) {
        this.procedures[name] = name_func_map;
        return $procedure;
    },
    load: function (name, start_step = "begin") {
        if (!name || !this.procedures.hasOwnProperty(name)) {
            $log(`load procedure ${name} failed. because no such procedure.`, "danger");
            return;
        }
        if (!start_step || !this.procedures[name].hasOwnProperty(start_step)) {
            $log(`load procedure ${name} failed. because no start_step:${start_step}.`, "danger");
            return;
        }
        if (this.hasOwnProperty("clean")) {
            this.now_procedure["clean"]();
        }

        this.now_step = start_step;
        this.now_procedure = this.procedures[name];
        return $procedure;
    },
    kill: function () {
        if (this.now_procedure == null) {
            $log("kill procedure failed. now_procedure is null.", "warning");
        }

        this.now_procedure = null;

        if (this.work_queue.length) {
            let name = this.work_queue.shift();
            $procedure.load(name).exec();
        }
        return $procedure;
    },
    exec: async function (data) {
        if (!this.now_procedure) {
            $log("exec procedure failed. because no availiable procedure.", "danger");
            return;
        }
        if (!this.now_procedure.hasOwnProperty(this.now_step)) {
            $log(`next procedure failed. ${this.now_procedure}["${this.now_step}"] is null, cannot be called.`, "warning");
        }

        await this.now_procedure[this.now_step](data);
        return $procedure;
    },
    next: function (step) {
        if (!this.now_procedure) {
            $log("next procedure failed. because no availiable procedure.", "danger");
            return;
        }
        if (!this.now_procedure.hasOwnProperty(this.now_step)) {
            $log(`next procedure failed. ${this.now_procedure}["${step}"] is null, cannot be called.`, "warning");
        }

        this.now_step = step;
        return $procedure;
    },
    add: function (name) {
        this.work_queue.push(name);
    },
};

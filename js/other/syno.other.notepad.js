{
    let template = `
        <div style="display: inline-table;">
            <!-- Button trigger notepad_modal -->
            <button class="btn btn-default" data-toggle="modal" :style="css_button"
                data-target="#notepad_modal">读写记事本</button>

            <!-- notepad_modal -->
            <div class="modal fade" id="notepad_modal" :style="css_notepad_modal">
                <div class="modal-dialog" :style="css_dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <div class="btn-group">
                                <button class="btn btn-success" @click="read_notepad">读记事本</button>
                                <button class="btn btn-danger" @click="write_notepad">写记事本</button>
                            </div>
                            <div class="progress" :style="css_process">
                                <div class="progress-bar progress-bar-striped active" role="progressbar" :style="{'width':progress}"></div>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div class="editor" style="width: 50em;display:inline-block;">

                                <div class="hex">
                                    <span v-for="(char, i) in text" :class="css_span(i)" @mousedown="mousedown(i, $event)" @keydown="keydown_hex"
                                        tabindex="1" @mouseup="mouseup(i)" @mousemove="mousemove(i, $event)" @click="click(i)"><!--
                                     -->{{char<16?"0"+char.toString(16):char.toString(16)}}</span>
                                </div>

                                <div class="text">
                                    <span v-for="(ascii, i) in text" :class="css_span(i)" @mousedown="mousedown(i, $event)" @keydown="keydown_text"
                                        tabindex="1" @mouseup="mouseup(i)" @mousemove="mousemove(i, $event)" @click="click(i)"><!--
                                     -->{{32<=ascii&&ascii<=126?String.fromCharCode(ascii):'.'}}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    let data_css = function () {
        return {
            css_button: {
                'display': 'inline-table',
            },
            css_notepad_modal: {
                'opacity': '1',
                'background': 'rgba(1,1,1,0.5)',
            },
            css_dialog: {
                'width': '50em',
                'top': '21%',
            },
            css_process: {
                'width': '70%',
                'height': '2em',
                'display': 'inline-block',
                'margin-bottom': '-0.75em',
            },
            notepad_id: 0,
            text: [],
            down: null,
            down_selection: null,
            move: null,
            selection: [],
            edited: [],
            cursor: 0,
            key: false,
            progress: "0%",
        }
    };

    let methods = {
        css_span: function (i) {
            return {
                'selection': this.selection[i],
                'edited': this.edited[i],
                'cursor': i == this.cursor,
            };
        },
        range: function (start, end) {
            if (end === undefined) {
                end = start;
                start = 0;
            }
            let ret = [];
            for (let i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        },
        mousedown: function (down, ev) {
            this.down = down;
            ev = (ev.which == 3);
            this.down_selection = !!(ev ^ this.selection[this.down]);
        },
        mousemove: function (move, ev) {
            if (this.down !== null) {
                ev = (ev.which == 1);

                if (move > this.down) {
                    if (this.move === null) {
                        this.move = this.down;
                    }

                    if (move > this.move) {
                        ev != ev;
                        for (let i = this.move; i <= move; i++) {
                            this.$set(this.selection, i, ev);
                        }
                    } else {
                        for (let i = this.move; i > move; i--) {
                            this.$set(this.selection, i, ev);
                        }
                    }
                } else {
                    if (this.move === null) {
                        this.move = this.down;
                    }

                    if (move < this.move) {
                        ev != ev;
                        for (let i = this.move; i >= move; i--) {
                            this.$set(this.selection, i, ev);
                        }
                    } else {
                        for (let i = this.move; i < move; i++) {
                            this.$set(this.selection, i, ev);
                        }
                    }
                }
            }
        },
        mouseup: function (up) {
            if (up === this.down) {
                this.$set(this.selection, up, this.down_selection);
            }
            this.down = null;
            this.move = null;
        },
        click: function (i) {
            this.cursor = i;
            this.key = false;
        },
        keydown_hex: function (ev) {
            let num = parseInt(String.fromCharCode(ev.keyCode), 16);
            if (this.key) {
                if (!isNaN(num)) {
                    this.$set(this.text, this.cursor, this.text[this.cursor] * 16 + num);
                    this.cursor += this.cursor < 511;
                    this.key = !this.key;
                } else if (ev.keyCode == 0x09) {
                    this.cursor += this.cursor < 511;
                    this.key = !this.key;
                }
            } else {
                if (!isNaN(num)) {
                    this.$set(this.text, this.cursor, num);
                    this.key = !this.key;
                } else if (ev.keyCode == 0x09) {
                    this.cursor += this.cursor < 511;
                }
            }
        },
        keydown_text: function (ev) {
            let num = ev.key.charCodeAt(0);
            if (32 <= num && num <= 126 && ev.key.length == 1) {
                this.$set(this.text, this.cursor, num);
                this.cursor += this.cursor < 511;
                this.key = false;
            } else if (ev.keyCode == 0x09) {
                this.cursor += this.cursor < 511;
                this.key = false;
            }
        },
        read_notepad: function () {
            $procedure.load("$syno.read_notepad").exec();
        },
        write_notepad: function () {
            if (this.text.length != 512) {
                $user_log("还没读记事本", "danger");
                return;
            }
            $procedure.load("$syno.write_notepad").exec(this.text);
        },
    };
    Vue.component('syno_notepad', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            icc_define_icc("notepad", text => this.text = text);
            icc_define_icc("notepad_progress", progress => this.progress = progress.toString(10) + "%");
        },
        mounted: function () {

        },
    });
}

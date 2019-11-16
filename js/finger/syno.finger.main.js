{
    let template = `
        <div :style="css_div">
            <button :style="css_syno_get_image" class="btn btn-default" @click="exec_procedure('$syno.get_image')">获取图像</button>
            <div class="input-group" :style="css_syno_finger_id">
                <span class="input-group-addon">指纹ID</span>
                <input type="text" class="form-control" placeholder="finger_id" v-model="finger_id"/>
            </div>

            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$syno.enroll')">注册</button>
            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$syno.match')">比对</button>
            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$syno.search')">搜索</button>

            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$syno.get_image', true)">连续采图</button>
            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$syno.match', true)">连续比对</button>
            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$syno.search', true)">连续搜索</button>

            <button :style="css_button" class="btn btn-danger"  @click="exec_procedure('$syno.emptychar')">清空指纹库</button>
            <button :style="css_button" class="btn btn-danger"  @click="exec_procedure('$syno.delchar')">删除指纹</button>
            <button :style="css_button" class="btn btn-warning" @click="exec_procedure('$syno.cancel')">取消指令</button>

            <button :style="css_button" class="btn btn-default" @click="exec_procedure('$syno.upchar')">上传指纹</button>
            <button :style="css_button" class="btn btn-default" @click="downchar()">下载指纹</button>
            <input  class="hide" id="downchar_file_selector"    @change="downchar($event)" type="file"/>
            <button :style="css_button" class="btn btn-default" @click="downimage()">下载图像</button>
            <input  class="hide" id="downimage_file_selector"   @change="downimage($event)" type="file"/>

            <label class="hint--top" aria-label="在采指纹环节用下载图像来代替采集图像" :style="css_checkbox">
                <input type="checkbox" v-model="is_from_file">
                使用文件指纹
            </label>

            <syno_finger_map :style="css_map"></syno_finger_map>
        </div>
    `;

    let data_css = function () {
        return {
            css_div: {
                'width': '23em',
                'padding': '1em',
                'border': '0.5em solid #d9edf7',
                'border-width': '0.5em',
                'z-index': '1',
            },
            css_syno_get_image: {
                'margin': '-1.3em 0.2em 0.5em',
                'width': '6em',
                'display': 'inline-table',
            },
            css_syno_finger_id: {
                'margin': '0.5em 0.15em',
                'width': '13em',
                'display': 'inline-table',
            },
            css_button: {
                'margin': '0.5em 0.2em',
                'width': '6em',
                'display': 'inline-table',
                'padding': '6px',
            },
            css_map: {
                'margin-top': '0.5em',
            },
            css_checkbox: {
                'position': 'absolute',
                'margin': '0.9em 0 0 1.2em',
            },
            exec_procedure: function (name, continued) {
                if (continued === undefined) {
                    $procedure.load(name).exec();
                } else {
                    $procedure.load(name).exec(continued);
                }
            },
            finger_id: 0,
            is_from_file: false,
        };
    };

    let methods = {
        downchar: function (e) {
            if (e === undefined) {
                $('#downchar_file_selector').trigger('click');
            } else {
                let path = $(e.target)[0].files[0].path;
                $user_log(`Down Char:${path}`);
                const buffer = $Buffer.alloc(2048);

                let fd = fs.openSync(path, "r");
                let bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
                fs.closeSync(fd);

                let param = [];
                for (let i = 0; i < bytesRead; i++) {
                    param.push(buffer[i]);
                }
                $procedure.load("$syno.downchar").exec(param);
            }
        },
        downimage: async function (e) {
            if (!this.is_from_file) {
                $user_log("未设置使用文件指纹");
                return;
            }
            if (e === undefined) {
                $('#downimage_file_selector').trigger('click');
            } else {
                let path = $(e.target)[0].files[0].path;
                $(e.target)[0].path = "";
                $user_log(`Down Image:${path}`);
                const buffer = $Buffer.allocUnsafe(65536);

                let image = await $canvas.loadImage(path);
                let ctx = $canvas.createCanvas(160, 160).getContext('2d');
                ctx.drawImage(image, 0, 0);
                let data = ctx.getImageData(0, 0, 160, 160);

                let param = [];
                for (let i = 0; i < data.data.length; i+=8) {
                    let high = data.data[i] % 16;
                    let low = data.data[i + 4] % 16;

                    param.push(high * 16 + low);
                }

                let data_packages = await $syno.request($syno.DownImage, undefined, param);
                for (data_package of data_packages) {
                    $port.write(data_package);
                }
            }
        }
    };

    Vue.component('syno_finger', {
        template: template,
        data: data_css,
        methods: methods,
        created: function () {
            icc_define_icc("get_finger_id", finger_id => finger_id.finger_id = this.finger_id);
            icc_define_icc("set_finger_id", finger_id => this.finger_id = finger_id.finger_id);
            icc_define_icc("is_from_file", is => is.is_from_file = this.is_from_file);
        },
    });
}

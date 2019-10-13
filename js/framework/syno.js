{
    window.$syno = {
        _package_header_length: 12,
        request: async function (code, param = [], data = []) {
            let address = {};
            await $bus.$emit("get_address", address);
            address = address.address;

            let data_packages = [];
            let datas = this.split(data);
            data_packages.push(this.convert({
                sign: 0x01,
                data: [code].concat(param),
                addr: address,
            }));
            for (let i = 0; i < datas.length; i++) {
                data_packages.push(this.convert({
                    sign: i == datas.length - 1 ? 0x08 : 0x02,
                    data: datas[i],
                    addr: address,
                }));
            }
            return data_packages;
        },
        split: function (data) {
            if (data instanceof Array) {
                //get size
                let ret = [];
                let size = 256;
                size -= this._package_header_length;
                for (let i = 0; i < data.length / size; i++) {
                    ret.push(data.slice(i * size, i * size + size));
                }
                return ret;
            } else {
                console.error("$syno.split need a Array");
            }
        },
        convert: function (cmd) {
            //addr,sign,data
            if (cmd.addr === undefined)
                console.error("$syno.convert addr is undefind");
            if (cmd.sign === undefined)
                console.error("$syno.convert sign is undefind");
            if (cmd.data === undefined)
                console.error("$syno.convert data is undefind");

            let data_package = [0xEF, 0x01];
            data_package.push(parseInt(cmd.addr.slice(0, 2), 16));
            data_package.push(parseInt(cmd.addr.slice(2, 4), 16));
            data_package.push(parseInt(cmd.addr.slice(4, 6), 16));
            data_package.push(parseInt(cmd.addr.slice(6, 8), 16));
            data_package.push(parseInt(cmd.sign));
            data_package.push((cmd.data.length + 2) / 256);
            data_package.push((cmd.data.length + 2) % 256);
            for (let data of cmd.data) {
                data_package.push(data);
            }
            let sum = 0;
            for (let i = 6; i < data_package.length; i++) {
                sum += data_package[i];
            }
            sum %= 65536;
            data_package.push(sum / 256);
            data_package.push(sum % 256);
            return data_package;
        },
        parse: function (datas) {
            let ret = {
                addr: "",
                retval: 0,
                data: [],
            };
            let sign = 0;
            let len = 0;

            ret.addr = (datas[2] < 16 ? "0" : "") + datas[2].toString(16);
            ret.addr += (datas[3] < 16 ? "0" : "") + datas[3].toString(16);
            ret.addr += (datas[4] < 16 ? "0" : "") + datas[4].toString(16);
            ret.addr += (datas[5] < 16 ? "0" : "") + datas[5].toString(16);

            while (datas.length) {
                if (datas[0] != 0xef || datas[1] != 0x01) {
                    console.error("$syno.parse failed, not EF01");
                    throw "$syno.parse failed, not EF01";
                }

                sign = datas[6];
                len = datas[7] * 256 + datas[8];

                for (let i = 0; i < len - 2; i++) {
                    ret.data.push(datas[i + 9]);
                }
                // TODO: checksum

                if (
                    !(
                        (sign == 0x07) ||
                        ((datas.length - len - 9) && sign == 0x01) ||
                        ((datas.length - len - 9) && sign == 0x02) ||
                        (!(datas.length - len - 9) && sign == 0x08)
                    )
                ) {
                    console.warn("sign is not right.", datas, sign, ret);
                }

                datas = datas.slice(len + 9);
            }

            ret.retval = ret.data.shift();
            return ret;
        },
        explain: function (retval) {
            switch (retval) {
                case 0x00: return "指令执行完毕或OK";
                case 0x01: return "数据包接收错误";
                case 0x02: return "传感器上没有手指";
                case 0x03: return "录入指纹图像失败或录入面积不足";
                case 0x04: return "指纹图像太干、太淡而生不成特征";
                case 0x05: return "指纹图像太湿、太糊而生不成特征";
                case 0x06: return "指纹图像太乱而生不成特征";
                case 0x07: return "指纹图像正常，但特征点太少（或面积太小）而生不成特征";
                case 0x08: return "指纹不匹配";
                case 0x09: return "没搜索到指纹";
                case 0x0a: return "特征合并失败";
                case 0x0b: return "访问指纹库时地址序号超出指纹库范围";
                case 0x0c: return "从指纹库读模板出错或无效";
                case 0x0d: return "上传特征失败";
                case 0x0e: return "模块不能接收后续数据包";
                case 0x0f: return "上传图像失败";
                case 0x10: return "删除模板失败";
                case 0x11: return "清空指纹库失败";
                case 0x12: return "不能进入低功耗状态";
                case 0x13: return "口令不正确";
                case 0x14: return "系统复位失败";
                case 0x15: return "缓冲区内没有有效原始图而生不成图像";
                case 0x16: return "在线升级失败";
                case 0x17: return "残留指纹或两次采集之间手指没有移动过";
                case 0x18: return "读写FLASH出错";
                case 0x19: return "随机数生成失败";
                case 0x1a: return "无效寄存器号";
                case 0x1b: return "寄存器设定内容错误号";
                case 0x1c: return "记事本页码指定错误";
                case 0x1d: return "端口操作失败";
                case 0x1e: return "自动注册（enroll）失败";
                case 0x1f: return "指纹库满";
                case 0x20: return "设备地址错误";
                case 0x21: return "密码有误";
                case 0x22: return "指纹模板非空";
                case 0x23: return "指纹模板为空";
                case 0x24: return "指纹库为空";
                case 0x25: return "录入次数设置错误";
                case 0x26: return "超时";
                case 0x27: return "指纹已存在";
                case 0x28: return "指纹模板有关联";
                case 0x29: return "传感器初始化失败";
                case 0x2A: return "模组唯一序列号非空";
                case 0x2B: return "模组唯一序列号为空";
                case 0x2C: return "OTP操作失败";
                case 0xf0: return "有后续数据包的指令，正确接收后用0xf0应答";
                case 0xf1: return "有后续数据包的指令，命令包用0xf1应答";
                case 0xf2: return "烧写内部FLASH时，校验和错误";
                case 0xf3: return "烧写内部FLASH时，包标识错误";
                case 0xf4: return "烧写内部FLASH时，包长度错误";
                case 0xf5: return "烧写内部FLASH时，代码长度太长";
                case 0xf6: return "烧写内部FLASH时，烧写FLASH失败";
                default: return "保留";
            }
        },
        GetImage: 0x01,
        GenChar: 0x02,
        Match: 0x03,
        Search: 0x04,
        RegModel: 0x05,
        StoreChar: 0x06,
        LoadChar: 0x07,
        UpChar: 0x08,
        DownChar: 0x09,
        UpImage: 0x0a,
        DownImage: 0x0b,
        DeleteChar: 0x0c,
        Empty: 0x0d,
        WriteReg: 0x0e,
        ReadSysPara: 0x0f,
        SetPwd: 0x12,
        VfyPwd: 0x13,
        GetRandomCode: 0x14,
        SetChipAddr: 0x15,
        ReadINFPage: 0x16,
        Port_Control: 0x17,
        WriteNotepad: 0x18,
        ReadNotepad: 0x19,
        BurnCode: 0x1a,
        HighSpeedSearch: 0x1b,
        GenBinImage: 0x1c,
        ValidTemplateNum: 0x1d,
        ReadIndexTable: 0x1f,
        GetEnrollImage: 0x29,
        Cancel: 0x30,
        AutoEnrollImage: 0x31,
        AutoIdentify: 0x32,
        GetChipSN: 0x34,
        HandShake: 0x35,
        CalibrateSensor: 0x36,
        生成模组唯一序列号: 0x37,
        获取模组唯一序列号: 0x38,
        获取指纹算法库版本号: 0x39,
        获取固件库版本号: 0x3a,
        ControlLED: 0x40,
        控制三色LED: 0x43,
    };
}
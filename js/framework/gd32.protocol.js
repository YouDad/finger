{
    let sign_data_not_end = 1;
    let sign_data_end = 2;

    window.$gd32 = {
        _package_header_length: 17,
        request: async function (code, param = [], data = []) {
            let address = await icc_get_address();
            let password = await icc_get_password();

            let data_packages = [];
            let datas = this.split(data);
            for (let i = 0; i < datas.length; i++) {
                data_packages.push(this.convert({
                    sign: i == datas.length - 1 ? sign_data_end : sign_data_not_end,
                    address,
                    password,
                    no: i,
                    cmd: code,
                    data: datas[i],
                }));
            }
            return data_packages;
        },
        split: function (data) {
            if (data instanceof Array) {
                //get size
                let ret = [];
                let size = 126;
                size -= this._package_header_length;
                for (let i = 0; i < data.length / size; i++) {
                    ret.push(data.slice(i * size, i * size + size));
                }
                return ret;
            } else {
                $log("$syno.split need a Array", "danger");
            }
        },
        convert: function (package) {
            let data_package = [0xEF, 0x02];
            data_package.push(parseInt(package.address.slice(0, 2), 16));
            data_package.push(parseInt(package.address.slice(2, 4), 16));
            data_package.push(parseInt(package.address.slice(4, 6), 16));
            data_package.push(parseInt(package.address.slice(6, 8), 16));
            data_package.push(parseInt(package.password.slice(0, 2), 16));
            data_package.push(parseInt(package.password.slice(2, 4), 16));
            data_package.push(parseInt(package.password.slice(4, 6), 16));
            data_package.push(parseInt(package.password.slice(6, 8), 16));
            data_package.push(package.no % 256);
            data_package.push(Math.floor(package.no / 256));
            data_package.push(package.cmd % 256);
            data_package.push(Math.floor(package.cmd / 256));
            data_package.push(package.sign);
            data_package.push(package.data.length % 256);
            data_package.push(Math.floor(package.data.length / 256));
            for (let data of package.data) {
                data_package.push(data);
            }
            let sum = this.GetCRC16(package.data, 0, package.data.length + _package_header_length);
            data_package.push(sum % 256);
            data_package.push(Math.floor(sum / 256));
            return data_package;
        },
        parse: function (datas) {
            if (datas === undefined) {
                throw "";
            }

            let ret = {
                address: "",
                password: "",
                cmd: 0,
                ack: 0,
                data: []
            };

            ret.address += (datas[2] < 16 ? "0" : "") + datas[2].toString(16);
            ret.address += (datas[3] < 16 ? "0" : "") + datas[3].toString(16);
            ret.address += (datas[4] < 16 ? "0" : "") + datas[4].toString(16);
            ret.address += (datas[5] < 16 ? "0" : "") + datas[5].toString(16);
            ret.password += (datas[6] < 16 ? "0" : "") + datas[6].toString(16);
            ret.password += (datas[7] < 16 ? "0" : "") + datas[7].toString(16);
            ret.password += (datas[8] < 16 ? "0" : "") + datas[8].toString(16);
            ret.password += (datas[9] < 16 ? "0" : "") + datas[9].toString(16);
            ret.cmd = datas[12] * 256 + datas[13];
            ret.ack = datas[17] * 256 + datas[18];

            while (datas.length) {
                if (datas[0] != 0xef || datas[1] != 0x02) {
                    $log("$gd32.parse failed, not EF02", "danger");
                    throw "$gd32.parse failed, not EF02";
                }
                let len = datas[15] * 256 + datas[16];

                for (let i = 0; i < len - 2; i++) {
                    ret.data.push(datas[i + 19]);
                }
                // TODO: checksum

                datas = datas.slice(len + 19);
            }

            return ret;
        },
        CRC16Table: [
            0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
            0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
            0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
            0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
            0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
            0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
            0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
            0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
            0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
            0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
            0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
            0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
            0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
            0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
            0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
            0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
            0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
            0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
            0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
            0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
            0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
            0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
            0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
            0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
            0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
            0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
            0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
            0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
            0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
            0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
            0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
            0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
        ],
        //X16 + X12 + X5 + 1 余式表
        GetCRC16: function (arr, start, end) {
            let result = 0;
            for (let i = start; i < end; i++) {
                result = (result << 8) ^ CRC16Table[(result >> 8) ^ arr[i]];
                result %= 1 << 16;
            }
            return result;
        },
        GetTestImage: 0x031F,
        CMD_DEVICE_RESET: 0x0320,
        CMD_DETECT_FINGER: 0x0321,
        GetRawImage: 0x0322,
        CMD_GET_REDRESS_IMAGE: 0x0323,
        CMD_UPLOAD_IMAGE: 0x0324,
        CMD_GEN_CHAR: 0x0325,
        CMD_MATCH_CHAR: 0x0326,
        CMD_STORE_CHAR: 0x0327,
        CMD_SEARCH_CHAR: 0x0328,
        CMD_DELETE_CHAR: 0x0329,
        CMD_EMPTY_CHAR: 0x032A,
        CMD_VERIFY_CHAR: 0x032B,
        CMD_GET_CHAR: 0x032C,
        CMD_PUT_CHAR: 0x032D,
        CMD_GET_MBINDEX: 0x032E,
        ReadRegister: 0x032F,
        WriteRegister: 0x0330,
        CMD_READ_PAR_TABLE: 0x0331,
        CMD_SET_BAUD_RATE: 0x0332,
        CMD_SET_SECURLEVEL: 0x0333,
        CMD_SET_CMOS_PARA: 0x0334,
        CMD_RESUME_FACTORY: 0x0335,
        CMD_MERGE_CHAR: 0x0336,
        CMD_SET_PSW: 0x0337,
        CMD_SET_ADDRESS: 0x0338,
        CMD_GET_RANDOM: 0x0339,
        CMD_DOWNLOAD_IMAGE: 0x0340,
        CMD_ERASE_PROGRAM: 0x0341,
        CMD_STORE_CHAR_DIRECT: 0x0342,
        CMD_READ_CHAR_DIRECT: 0x0343,
        CMD_GET_FIRSTVALID_ADD: 0x0344,
        CMD_CHIP_ERASE: 0x0380,
        DeviceInfo: 0x0381,
    };
}

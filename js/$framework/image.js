{
    function data_to_rgba(data) {
        const arr = new Uint8ClampedArray(4 * 160 * 160);
        if (data.length == 160 * 160 / 2) {
            for (let i = 0; i < arr.length; i += 8) {
                let pixel = data[i / 8];
                arr[i + 0] = arr[i + 1] = arr[i + 2] = Math.floor(pixel / 16) * 16;
                arr[i + 4] = arr[i + 5] = arr[i + 6] = pixel % 16 * 16;
                arr[i + 3] = arr[i + 7] = 255;
            }
        } else {
            for (let i = 0; i < arr.length; i += 4) {
                let pixel = data[i / 4];
                arr[i + 0] = arr[i + 1] = arr[i + 2] = pixel;
                arr[i + 3] = 255;
            }
        }
        return arr;
    }

    function rgba_to_grey(rgba) {
        const grey = new Uint8ClampedArray(160 * 160);
        for (let i = 0; i * 4 < rgba.length; i++) {
            grey[i] = rgba[i * 4 + 0] * 0.30
                    + rgba[i * 4 + 1] * 0.59
                    + rgba[i * 4 + 2] * 0.11;
        }
        return grey;
    }

    function bmp_reverse_line(image) {
        let k;
        for (let i = 0; i < 160 - 1 - i; i++) {
            for (let j = 0; j < 160; j++) {
                k = image[i * 160 + j];
                image[i * 160 + j] = image[(160 - 1 - i) * 160 + j];
                image[(160 - 1 - i) * 160 + j] = k;
            }
        }
    }

    icc_define_icc("convert_image", async function (result) {
        const canvas = $canvas.createCanvas(160, 160);
        const ctx = canvas.getContext('2d');
        let arr = data_to_rgba(result.data);
        let imageData = $canvas.createImageData(arr, 160);
        ctx.putImageData(imageData, 0, 0);
        result.src = canvas.toDataURL();
        if (await icc_is_save_image()) {
            icc_save_png(canvas.toBuffer());
            let bmp = rgba_to_grey(arr);
            bmp_reverse_line(bmp);
            icc_save_bmp(bmp);
        }
    });
}

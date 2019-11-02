{
    icc_define_icc("convert_image", async function (result) {
        const canvas = $canvas.createCanvas(160, 160);
        const ctx = canvas.getContext('2d');
        const arr = new Uint8ClampedArray(4 * 160 * 160);
        for (let i = 0; i < arr.length; i += 8) {
            let pixel = result.data[i / 8];
            arr[i + 0] = arr[i + 1] = arr[i + 2] = Math.floor(pixel / 16) * 16;
            arr[i + 4] = arr[i + 5] = arr[i + 6] = pixel % 16 * 16;
            arr[i + 3] = arr[i + 7] = 255;
        }
        let imageData = $canvas.createImageData(arr, 160);
        ctx.putImageData(imageData, 0, 0);
        result.src = canvas.toDataURL();
        if (await icc_is_save_image()) {
            icc_save_png(canvas.toBuffer());
        }
    });
}
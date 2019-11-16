async function icc_get_baud() {
    let data = {};
    await $bus.$emit("get_baud", data);
    return data.baud;
}

async function icc_get_device() {
    let data = {};
    await $bus.$emit("get_device", data);
    return data.device;
}

async function icc_get_address() {
    let data = {};
    await $bus.$emit("get_address", data);
    return data.address;
}

async function icc_get_password() {
    let data = {};
    await $bus.$emit("get_password", data);
    return data.password;
}

async function icc_get_finger_id() {
    let data = {};
    await $bus.$emit("get_finger_id", data);
    return data.finger_id;
}

async function icc_set_finger_id(finger_id) {
    await $bus.$emit("set_finger_id", { finger_id });
}

async function icc_save_char(char) {
    await $bus.$emit("save_char", char);
}

async function icc_show_image(image) {
    await $bus.$emit("show_image", image);
}

async function icc_get_dbsize() {
    let data = {};
    await $bus.$emit("get_dbsize", data);
    return data.dbsize;
}

async function icc_set_finger_map(finger_map) {
    await $bus.$emit("set_map", finger_map);
}

async function icc_save_png(image) {
    await $bus.$emit("save_png", image);
}

async function icc_open_explorer() {
    await $bus.$emit("open_explorer");
}

async function icc_convert_image(image) {
    await $bus.$emit("convert_image", image);
    return image.src;
}

async function icc_set_address(address) {
    await $bus.$emit("set_address", { address });
}

async function icc_set_devinfo(info) {
    await $bus.$emit("set_devinfo", info);
}

async function icc_leds_back() {
    await $bus.$emit("leds_back");
}

async function icc_set_notepad_progress(progress) {
    await $bus.$emit("notepad_progress", progress);
}

async function icc_set_notepad(notepad) {
    await $bus.$emit("notepad", notepad);
}

async function icc_is_from_file() {
    let is = {};
    await $bus.$emit("is_from_file", is);
    return is.is_from_file;
}

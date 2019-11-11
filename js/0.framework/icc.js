async function icc_notify(type, message) {
    await $bus.$emit(`notify.${type}`, message);
}

async function $user_log(message, type = "info") {
    await $bus.$emit("log", { message, type, level: 0, });
}

async function $test_log(message, type = "info") {
    await $bus.$emit("log", { message, type, level: 1, });
}

async function $log(message, type = "info") {
    await $bus.$emit("log", { message, type, level: 2, });
}

async function icc_is_save_image() {
    let data = {};
    await $bus.$emit("is_save_image", data);
    return data.is_save_image;
}

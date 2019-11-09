async function icc_set_value(data) {
    await $bus.$emit("set_value", { value: data });
}

async function icc_set_devinfo(data) {
    await $bus.$emit("set_devinfo", data);
}
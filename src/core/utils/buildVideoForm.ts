export function buildVideoForm(file: File, options: object): FormData {
    console.log("file instanceof File:", file instanceof File);
    console.log("file:", file);
    const form = new FormData();
    form.append("video", file);

    for (const [key, value] of Object.entries(options)) {
        if (value !== undefined) {
            form.append(key, String(value));
        }
    }

    return form;
}
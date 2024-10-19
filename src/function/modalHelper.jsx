export function show(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById(id), { backdrop: false, keyboard: true, focus: true }).show()
}

export function hide(id) {
    bootstrap.Modal.getInstance(document.getElementById(id)).hide()
}
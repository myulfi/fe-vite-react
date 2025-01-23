export function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function formatMoney(value) {
    return value?.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") ?? 0;
}

export function roundNumber(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)
}

export function format(template, ...values) {
    return template.replace(/{(\d+)}/g, (match, index) => {
        return typeof values[index] !== 'undefined' ? values[index] : match;
    });
}

export function downloadFile(name, data) {
    const url = window.URL.createObjectURL(new Blob(data))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", name)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

export function formatBytes(value) {
    if (value === 0) return '0 Bytes'
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    let idx = Math.floor(Math.log(value) / Math.log(1024))
    if (idx > sizes.length - 1) idx = sizes.length - 1
    return formatMoney((value / Math.pow(1024, idx)).toFixed(2)) + ' ' + sizes[idx]
}
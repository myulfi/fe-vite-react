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
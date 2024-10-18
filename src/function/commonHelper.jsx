export function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function moneyFormat(value) {
    return value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
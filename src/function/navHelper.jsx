export function select(name, id) {
    Array.from(document.getElementsByClassName(`nav_item_${name}`)).forEach(element => element.classList.remove('active'))
    Array.from(document.getElementsByClassName(`tab_pane_${name}`)).forEach(element => element.classList.remove('active'))
    document.getElementById(`nav_item_${name}_menu${id}`).classList.add('active')
    document.getElementById(`tab_pane_${name}_menu${id}`).classList.add('active')
}
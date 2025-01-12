import "./href.css"

export default function Href({
    label = "Button",
    onClick = () => { alert("Please define your function!") },
}) {
    return (
        <a className="href" onClick={onClick}>{label}</a>
    )
}
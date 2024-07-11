export default function Dropdown({
    label = "Button"
    , icon = "bi-caret-right"
    , onClick = () => { alert("Please define your function!") }
}) {
    return (
        <a className="dropdown-item" onClick={() => onClick()} role="button">
            <span className={icon}>&nbsp;{label}</span>
        </a>
    );
}
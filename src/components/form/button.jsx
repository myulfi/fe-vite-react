export default function Button({
    label = "Button",
    className = "btn-primary",
    size = "sm",
    icon = "bi-square",
    loadingFlag = false,
    onClick = () => { alert("Please define your function!") },
}) {
    return (
        <button className={`btn btn-${size} ${className} rounded-sm shadow border-0 m-1`} disabled={loadingFlag} onClick={onClick}>
            <span className={loadingFlag ? "spinner-grow spinner-grow-sm mx-2" : null} role="status" aria-hidden="true" />
            <span className={icon}>{label.length > 0 ? " " : ""}{label}</span>
        </button>
    );
}
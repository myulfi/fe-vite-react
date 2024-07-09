export default function ButtonTable({
    label
    , className
    , icon
    , isLoading
    , onClick
}) {
    return (
        <button className={`btn btn-sm ${className} rounded-sm shadow border-0 m-1`} disabled={isLoading ? "disabled" : ""} onClick={onClick}>
            <span className={isLoading ? "spinner-grow spinner-grow-sm mx-2" : ""} role="status" aria-hidden="true" />
            <span className={icon}>&nbsp;{label}</span>
        </button>
    );
}
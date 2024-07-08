export default function Button({
    label
    , className
    , onClick
}) {
    return (
        <button className={`btn ${className} border-0 shadow-sm`} type="button" onClick={onClick}>
            {label}
        </button>
    );
}
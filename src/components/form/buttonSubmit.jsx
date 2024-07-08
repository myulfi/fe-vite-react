export default function ButtonSubmit({
    label
    , buttonClass
    , onClick
}) {
    return (
        // btn btn-md btn-primary rounded-sm shadow border-0
        <button className={`btn ${buttonClass} border-0 shadow-sm`} type="button" onClick={onClick}>
            {label}
        </button>
    );
}
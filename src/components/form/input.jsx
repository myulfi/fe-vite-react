export default function Input({
    label
    , name
    , type
    , value
    , onChange
    , placeholder
    , className
    , error
}) {
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <input className="form-control" name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} />
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    );
}
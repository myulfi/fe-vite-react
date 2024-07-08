export default function Textarea({
    label
    , name
    , rows
    , value
    , onChange
    , placeholder
    , className
    , error
}) {
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <textarea className="form-control" name={name} rows={rows} value={value} onChange={onChange} placeholder={placeholder}></textarea>
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    );
}
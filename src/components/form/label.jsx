export default function Label({
    text
    , value
    , className
}) {
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{text}</label>
            <label className="col-12">{value}</label>
        </div>
    );
}
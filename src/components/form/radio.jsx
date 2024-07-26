export default function Radio({
    label
    , name
    , value
    , map
    , onChange
    , className
    , error
}) {
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <div className="py-1">
                {
                    map.map((object) => (
                        <div key={object.key} className="form-check form-check-inline">
                            <input className="form-check-input" name={name} type="radio" value={object.key} checked={parseInt(value) === object.key} onChange={onChange} />
                            <label className="form-check-label">
                                {object.value}
                            </label>
                        </div>
                    ))
                }
            </div>
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    );
}
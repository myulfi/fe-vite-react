export default function Select({
    label
    , name
    , value
    , map
    , onChange
    , placeholder
    , className
    , error
}) {
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <select className="form-control" name={name} value={value} onChange={onChange}>
                <option value="" disabled>{placeholder}</option>
                {
                    map.map((object) => (
                        <option value={object.key} key={object.key}>{object.value}</option>
                    ))
                }
            </select>
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div >
    );
}
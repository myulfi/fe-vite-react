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
        <>
            <div className={`form-group mb-3 ${className}`}>
                <label className="form-label fw-bold">{label}</label>
                {
                    map.map((object) => (
                        <div key={object.key}>
                            <input className="" name={name} type="radio" value={object.key} checked={parseInt(value) === object.key} onChange={onChange} />
                            &nbsp;{object.value}
                        </div>
                    ))
                }
                {error && <small className="text-danger mt-1 px-1">{error}</small>}
            </div >
        </>
    );
}
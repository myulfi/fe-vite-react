import { Fragment } from "react";

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
            <div>
                {
                    map.map((object) => (
                        <Fragment key={object.key}>
                            <input type="radio" className="btn-check" name={name} value={object.key} id={name + "_" + object.key} checked={parseInt(value) === object.key} onChange={onChange} autoComplete="off" />
                            <label className="btn btn-outline-secondary me-1" htmlFor={name + "_" + object.key}>{object.value}</label>
                        </Fragment>
                    ))
                }
            </div>
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    );
}
import Filter from "./filter";

export default function RangeFilter({
    label
    , icon = "bi-search"
    , name
    , min = 0
    , max = 100
    , value
    , onChange
    , className = "col-xs-12"
    , delay = 1
}) {
    return (
        <Filter label={label + " (" + value + ")"} icon={icon} className={className} delay={delay}>
            <input className="my-1 form-range" name={name} type="range" min={min} max={max} value={value} onChange={onChange} />
        </Filter>
    );
}
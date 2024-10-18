import Filter from "./filter";

export default function DateFilter({
    label,
    icon = "bi-search",
    name,
    value,
    onChange,
    className = "col-xs-12",
    delay = 1,
}) {
    return (
        <Filter label={label} icon={icon} className={className} delay={delay}>
            <input className="form-control" name={name} type="date" value={value} onChange={onChange} />
        </Filter>
    )
}
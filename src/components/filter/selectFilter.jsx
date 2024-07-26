import Filter from './filter';

export default function SelectFilter({
    label
    , icon = "bi-search"
    , name
    , value
    , map
    , onChange
    , placeholder
    , className = "col-xs-12"
    , delay = 1
}) {
    return (
        <Filter label={label} icon={icon} className={className} delay={delay}>
            <select className="form-select" name={name} value={value} onChange={onChange}>
                <option value="">{placeholder}</option>
                {
                    map.map((object) => (
                        <option value={object.key} key={object.key}>{object.value}</option>
                    ))
                }
            </select>
        </Filter>
    );
}
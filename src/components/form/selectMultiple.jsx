import { useState } from "react";

export default function SelectMultiple({
    label
    , name
    , valueMultiple
    , map
    , liveSearch = false
    , actionBox = false
    , dataSize = 5
    , onChange
    , placeholder
    , className
    , error
}) {
    const [itemList, setItemList] = useState(map);
    const [searchValue, setSearchValue] = useState("");

    const labelValueChange = () => {
        return valueMultiple === undefined || valueMultiple.length === 0 ? placeholder : valueMultiple.length > 1 ? `${valueMultiple.length} items selected` : map.find((object) => { if (object.key === valueMultiple[0]) return object }).value;
    }

    const [labelValue, setLabelValue] = useState(labelValueChange());

    const onSelect = (id) => {
        if (valueMultiple.includes(id)) {
            valueMultiple.splice(valueMultiple.indexOf(id), 1)
        } else {
            valueMultiple.push(id);
        }

        onChange({
            target: {
                name: name,
                value: valueMultiple,
            }
        })
        setLabelValue(labelValueChange())
    }

    const onSearchChange = (e) => {
        const { value } = e.target;
        setSearchValue(value)
        setItemList(map.filter(item => { if (item.value.toLowerCase().includes(value.toLowerCase())) { return item; } }))
    }

    const selectAll = () => {
        for (let i = 0; i < itemList.length; i++) {
            if (valueMultiple.includes(itemList[i].key) === false) {
                valueMultiple.push(itemList[i].key)
            }
        }

        onChange({
            target: {
                name: name,
                value: valueMultiple,
            }
        })
        setLabelValue(labelValueChange())
    }

    const deselectAll = () => {
        for (let i = itemList.length - 1; i >= 0; i--) {
            if (valueMultiple.includes(itemList[i].key)) {
                valueMultiple.splice(valueMultiple.indexOf(itemList[i].key), 1)
            }
        }
        onChange({
            target: {
                name: name,
                value: valueMultiple,
            }
        })
        setLabelValue(labelValueChange())
    }

    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <div className="dropdown form-control p-0">
                <button className="btn w-100 text-start" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                    <div className="d-flex bd-highlight">
                        <div className="flex-grow-1 bd-highlight text-muted">{labelValue}</div>
                        <div className="bd-highlight"><span className="bi-chevron-down"></span></div>
                    </div>
                </button>

                <ul className="dropdown-menu">
                    {
                        liveSearch &&
                        <li className="px-2 py-1">
                            <input className="form-control" value={searchValue} onChange={onSearchChange} />
                        </li>
                    }
                    {
                        actionBox &&
                        <li className="px-2 py-1">
                            <span className="btn btn-sm btn-outline-secondary col-6" onClick={selectAll}>Select&nbsp;All</span>
                            <span className="btn btn-sm btn-outline-secondary col-6" onClick={deselectAll}>Deselect&nbsp;All</span>
                        </li>
                    }
                    <li>
                        <ul className="list-group overflow-auto" style={{ maxHeight: `${dataSize * 32}px` }}>
                            {
                                itemList.map((object) => (
                                    <li key={object.key} onClick={() => onSelect(object.key)}>
                                        <div className="dropdown-item d-flex bd-highlight">
                                            <div className="flex-grow-1 bd-highlight">{object.value}</div>
                                            <div className="bd-highlight"><span className={valueMultiple !== undefined && valueMultiple.indexOf(object.key) >= 0 ? "bi-check-lg" : null}></span></div>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </li>
                </ul>
            </div>
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    );
}
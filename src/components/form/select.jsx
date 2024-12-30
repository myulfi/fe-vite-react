import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

export default function Select({
    label,
    name,
    value,
    multiple = false,
    map,
    dataSize = 5,
    onChange,
    className,
    error,
}) {
    const { t } = useTranslation()
    const [itemList, setItemList] = useState(map)
    const [searchValue, setSearchValue] = useState("")

    const dropdownRef = useRef(null)
    const valueRef = useRef(value)
    if (multiple) {
        useEffect(() => {
            const dropdownElement = dropdownRef.current

            const handleHiddenEvent = () => {
                onChange({
                    target: {
                        name: name,
                        value: valueRef.current,
                    }
                })
            }

            if (dropdownElement) dropdownElement.addEventListener('hidden.bs.dropdown', handleHiddenEvent)

            return () => {
                if (dropdownElement) {
                    dropdownElement.removeEventListener('hidden.bs.dropdown', handleHiddenEvent);
                }
            }
        }, [])
    }

    useEffect(() => {
        setItemList(map)
        labelValueChange(value)
    }, [map])

    useEffect(() => {
        valueRef.current = value
        labelValueChange(valueRef.current)
    }, [value])


    const [labelValue, setLabelValue] = useState()
    const labelValueChange = (value) => {
        if (multiple) {
            setLabelValue(value === undefined || value.length === 0 ? t("common.text.selectName", { name: label }) : value.length > 1 ? `${value.length} items selected` : map.find((object) => { if (object.key === value[0]) return object }).value)
        } else {
            const obj = map.find((object) => { if (object.key === value) return object })
            if (obj === undefined) {
                setLabelValue(t("common.text.selectName", { name: label }))
            } else {
                setLabelValue(obj.value)
            }
        }
    }

    // const [labelValue, setLabelValue] = useState(labelValueChange(value))

    const onSelect = (id) => {
        if (multiple) {
            if (value.includes(id)) {
                value.splice(value.indexOf(id), 1)
            } else {
                value.push(id)
            }
            valueRef.current = value
        } else {
            value = id
        }

        if (!multiple) {
            onChange({
                target: {
                    name: name,
                    value: value,
                }
            })
        }
        // setLabelValue(labelValueChange())
        labelValueChange(value)
    }

    const onSearchChange = (e) => {
        const { value } = e.target
        setSearchValue(value)
        setItemList(map.filter(item => { if (item.value.toLowerCase().includes(value.toLowerCase())) { return item } }))
    }

    const selectAll = () => {
        for (let i = 0; i < itemList.length; i++) {
            if (value.includes(itemList[i].key) === false) {
                value.push(itemList[i].key)
            }
        }

        // setLabelValue(labelValueChange())
        labelValueChange(value)
    }

    const deselectAll = () => {
        for (let i = itemList.length - 1; i >= 0; i--) {
            if (value.includes(itemList[i].key)) {
                value.splice(value.indexOf(itemList[i].key), 1)
            }
        }

        // setLabelValue(labelValueChange())
        labelValueChange(value)
    }

    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <div className="dropdown form-control p-0" ref={dropdownRef}>
                <button className="btn w-100 text-start" type="button" data-bs-toggle="dropdown" data-bs-auto-close={multiple ? "outside" : "true"} aria-expanded="false" onClick={() => onSearchChange({ target: { value: "" } })}>
                    <div className="d-flex bd-highlight">
                        <div className="flex-grow-1 bd-highlight text-muted">{labelValue}</div>
                        <div className="bd-highlight"><span className="bi-chevron-down"></span></div>
                    </div>
                </button>

                <ul className="dropdown-menu">
                    {
                        map.length > dataSize &&
                        <li className="px-2 py-1">
                            <input className="form-control" value={searchValue} onChange={onSearchChange} />
                        </li>
                    }
                    {
                        multiple && map.length > dataSize &&
                        <li className="px-2 py-1">
                            <span className="btn btn-sm btn-outline-secondary col-6 text-nowrap" onClick={selectAll}>{t("common.button.selectAll")}</span>
                            <span className="btn btn-sm btn-outline-secondary col-6 text-nowrap" onClick={deselectAll}>{t("common.button.deselectAll")}</span>
                        </li>
                    }
                    <li>
                        <ul className="list-group overflow-auto" style={{ maxHeight: `${dataSize * 32}px` }}>
                            {
                                itemList.map((object) => (
                                    <li key={object.key} role="button" onClick={() => onSelect(object.key)}>
                                        <div className="dropdown-item d-flex bd-highlight">
                                            <div className="flex-grow-1 bd-highlight">{object.value}</div>
                                            <div className="bd-highlight">
                                                <span
                                                    className={
                                                        value !== undefined
                                                            && (
                                                                (multiple && valueRef.current.indexOf(object.key) >= 0)
                                                                || (!multiple && value === object.key)
                                                            )
                                                            ? "bi-check-lg" : ""
                                                    } />
                                            </div>
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
    )
}
import { useEffect, useRef, useState } from "react"
import Filter from "./filter"
import { useTranslation } from "react-i18next"

export default function SelectFilter({
    label,
    icon = "bi-search",
    name,
    multiple = false,
    value,
    map,
    liveSearch = false,
    actionBox = false,
    dataSize = 5,
    onChange,
    placeholder = "All",
    className = "col-xs-12",
    delay = 1,
}) {
    const { t } = useTranslation()
    const [itemList, setItemList] = useState(map)
    const [searchValue, setSearchValue] = useState("")

    const dropdownRef = useRef(null)

    if (multiple) {
        useEffect(() => {
            const dropdownElement = dropdownRef.current

            const handleHiddenEvent = () => {
                onChange({
                    target: {
                        name: name,
                        value: value,
                    }
                })
            }

            if (dropdownElement) dropdownElement.addEventListener('hidden.bs.dropdown', handleHiddenEvent)

            return () => {
                if (dropdownElement) {
                    dropdownElement.removeEventListener('hidden.bs.dropdown', handleHiddenEvent)
                }
            }
        }, [])
    }

    useEffect(() => {
        setLabelValue(labelValueChange())
        setItemList(map)
    }, [map])

    const labelValueChange = () => {
        if (multiple) {
            return value === undefined || value.length === 0 ? placeholder : value.length > 1 ? t("common.text.amountItemSelected", { amount: value.length }) : map.find((object) => { if (object.key === value[0]) return object }).value
        } else {
            return value === undefined || value === 0 ? placeholder : map.find((object) => { if (object.key === value) return object })?.value
        }
    }

    const [labelValue, setLabelValue] = useState(labelValueChange())

    const onSelect = (id) => {
        if (multiple) {
            if (value.includes(id)) {
                value.splice(value.indexOf(id), 1)
            } else {
                value.push(id)
            }
        } else {
            if (value === id) {
                value = 0
            } else {
                value = id
            }

            onChange({
                target: {
                    name: name,
                    value: value,
                }
            })
        }

        setLabelValue(labelValueChange())
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

        setLabelValue(labelValueChange())
    }

    const deselectAll = () => {
        for (let i = itemList.length - 1; i >= 0; i--) {
            if (value.includes(itemList[i].key)) {
                value.splice(value.indexOf(itemList[i].key), 1)
            }
        }

        setLabelValue(labelValueChange())
    }

    return (
        <Filter label={label} icon={icon} className={className} delay={delay}>
            <div className="dropdown form-control p-0" ref={dropdownRef}>
                <button className="btn w-100 text-start" type="button" data-bs-toggle="dropdown" data-bs-auto-close={multiple ? "outside" : "true"} aria-expanded="false">
                    <div className="d-flex bd-highlight">
                        <div className="flex-grow-1 bd-highlight text-muted text-truncate">{labelValue}{multiple}</div>
                        <div className="bd-highlight"><span className="bi-chevron-down"></span></div>
                    </div>
                </button>

                <ul className="dropdown-menu shadow-sm">
                    {
                        liveSearch &&
                        <li className="px-2 py-1">
                            <input className="form-control" value={searchValue} onChange={onSearchChange} />
                        </li>
                    }
                    {
                        multiple && actionBox &&
                        <li className="px-2 py-1">
                            <span className="btn btn-sm btn-outline-secondary col-6 text-nowrap" onClick={selectAll}>{t("common.button.selectAll")}</span>
                            <span className="btn btn-sm btn-outline-secondary col-6 text-nowrap" onClick={deselectAll}>{t("common.button.deselectAll")}</span>
                        </li>
                    }
                    <li>
                        <ul className="list-group overflow-auto" style={{ maxHeight: `${dataSize * 32}px` }}>
                            {
                                itemList.map((object) => (
                                    <li key={object.key} onClick={() => onSelect(object.key)} role="button">
                                        <div className="dropdown-item d-flex bd-highlight">
                                            <div className="flex-grow-1 bd-highlight">{object.value}</div>
                                            <div className="bd-highlight"><span className={
                                                (
                                                    (multiple && value !== undefined && value.indexOf(object.key) >= 0)
                                                    || (!multiple && value === object.key)
                                                )
                                                    ? "bi-check-lg" : null
                                            }></span></div>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </li>
                </ul>
            </div>
        </Filter>
    )
}
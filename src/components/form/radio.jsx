import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function Radio({
    label,
    name,
    value,
    map,
    customFlag = false,
    onChange,
    className,
    error,
}) {
    const { t } = useTranslation()
    const [valueInput, setValueInput] = useState("")

    useEffect(() => {
        setValueInput(map.findIndex(x => x.key === Number(value)) >= 0 ? valueInput : value)
    }, [value])


    const onRadioChange = (e) => {
        const { name, value } = e.target
        setValueInput("")
        onChange({
            target: {
                name: name,
                value: value
            }
        })
    }

    const onInputChange = (e) => {
        const { name, value } = e.target
        setValueInput(value)
        onChange({
            target: {
                name: name,
                value: value
            }
        })
    }

    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <div className="d-flex align-content-start flex-wrap">
                {
                    map.map((object) => (
                        <div className="pe-2 pb-2" style={{ width: "100px" }} key={object.key}>
                            <input type="radio" className="btn-check" name={name} value={object.key} id={name + "_" + object.key} checked={parseInt(value) === object.key} onChange={onRadioChange} autoComplete="off" />
                            <label className="btn btn-outline-secondary w-100" htmlFor={name + "_" + object.key}>{object.value}</label>
                        </div>
                    ))
                }
                {
                    customFlag &&
                    <div className="pe-2 pb-2" style={{ width: "100px" }}>
                        <input
                            type="text"
                            className="form-control w-100"
                            value={valueInput === 0 ? "" : valueInput}
                            name={name}
                            onChange={onInputChange}
                            autoComplete="off"
                            placeholder={t("common.text.otherValue")}
                        />
                    </div>
                }
            </div>
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    )
}
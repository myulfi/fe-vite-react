import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

export default function InputDecimal({
    label,
    name,
    value,
    disabled = false,
    decimal = 0,
    onChange,
    positionUnit,
    nameUnit,
    valueUnit,
    valueUnitList,
    onChangeUnit,
    className,
    error,
}) {
    const { t } = useTranslation()
    const inputRef = useRef(null)
    const [valueInput, setValueInput] = useState("")

    useEffect(() => {
        setValueInput(formatToMoney((value ?? "").toString().replace(".", ",")))
    }, [value])

    const formatToMoney = (input) => {
        let [integerPart, decimalPart] = input.replace(/(,)(?=.*,)|[^0-9,]/g, '').split(",")
        if (integerPart) integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        if (decimalPart) decimalPart = decimalPart.substring(0, decimal)
        return decimalPart !== undefined ? `${integerPart},${decimalPart}` : integerPart
    }

    const onInputChange = (e) => {
        const { name, value, selectionStart } = e.target
        const formattedValue = formatToMoney(value)
        setValueInput(formattedValue)
        onChange({
            target: {
                name: name,
                value: Number(formattedValue.replace(/\./g, "").replace(/,/g, "."))
            }
        })
        setTimeout(() => {
            inputRef.current.setSelectionRange(selectionStart > 3 ? selectionStart + 1 : selectionStart, selectionStart > 3 ? selectionStart + 1 : selectionStart)
        }, 0)
    }

    const onInputUnitChange = (e) => {
        const { name, value } = e.target
        onChangeUnit({
            target: {
                name: name,
                value: Number(value)
            }
        })
    }

    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            {
                positionUnit === undefined
                && <input
                    ref={inputRef}
                    className="form-control"
                    name={name} type="text"
                    value={valueInput}
                    disabled={disabled}
                    onChange={onInputChange}
                    placeholder={t("common.text.inputName", { name: label })}
                />
            }
            {
                positionUnit !== undefined
                && <div className="input-group">
                    {
                        positionUnit === "left"
                        && <span className="input-group-text">{valueUnit}</span>
                    }
                    {
                        positionUnit === "left" && valueUnitList !== undefined
                        && <select className="form-select px-2" name={nameUnit} value={valueUnit} disabled={disabled} onChange={onInputUnitChange}>
                            {
                                valueUnitList.map((object) => (
                                    <option value={object.key} key={object.key}>{object.value}</option>
                                ))
                            }
                        </select>
                    }
                    <input
                        ref={inputRef}
                        className="form-control"
                        name={name} type="text"
                        value={valueInput}
                        disabled={disabled}
                        onChange={onInputChange}
                        placeholder={t("common.text.inputName", { name: label })}
                    />
                    {
                        positionUnit !== "left" && valueUnitList === undefined
                        && <span className="input-group-text">{valueUnit}</span>
                    }
                    {
                        positionUnit !== "left" && valueUnitList !== undefined
                        && <select className="form-select px-2" name={nameUnit} value={valueUnit} disabled={disabled} onChange={onInputUnitChange}>
                            {
                                valueUnitList.map((object) => (
                                    <option value={object.key} key={object.key}>{object.value}</option>
                                ))
                            }
                        </select>
                    }
                </div>

            }
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    )
}
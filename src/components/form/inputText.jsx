import { useTranslation } from "react-i18next"

export default function InputText({
    label,
    name,
    value,
    disabled = false,
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
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            {
                positionUnit === undefined
                && <input className="form-control" name={name} type="text" value={value} disabled={disabled} onChange={onChange} placeholder={t("common.text.inputName", { name: label })} />
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
                        && <select className="input-group-text" name={nameUnit} value={valueUnit} disabled={disabled} onChange={onChangeUnit}>
                            {
                                valueUnitList.map((object) => (
                                    <option value={object.key} key={object.key}>{object.value}</option>
                                ))
                            }
                        </select>
                    }
                    <input className="form-control" name={name} type="text" value={value} disabled={disabled} onChange={onChange} placeholder={t("common.text.inputName", { name: label })} />
                    {
                        positionUnit !== "left" && valueUnitList === undefined
                        && <span className="input-group-text">{valueUnit}</span>
                    }
                    {
                        positionUnit !== "left" && valueUnitList !== undefined
                        && <select className="input-group-text" name={nameUnit} value={valueUnit} disabled={disabled} onChange={onChangeUnit}>
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
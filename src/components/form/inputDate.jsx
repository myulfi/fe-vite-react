import { useTranslation } from "react-i18next"

export default function InputDate({
    label,
    name,
    value,
    disabled = false,
    onChange,
    className,
    error,
}) {
    const { t } = useTranslation()
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <input className="form-control" name={name} type="date" value={value} disabled={disabled} onChange={onChange} placeholder={t("common.text.selectName", { name: label })} />
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    )
}
import { useTranslation } from "react-i18next"

export default function InputPassword({
    label,
    name,
    value,
    onChange,
    className,
    error,
}) {
    const { t } = useTranslation()
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <input className="form-control" name={name} type="password" value={value} onChange={onChange} placeholder={t("common.text.inputName", { name: label })} />
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    )
}
import { useTranslation } from "react-i18next"

export default function Textarea({
    label,
    name,
    rows,
    value,
    disabled = false,
    onChange,
    onKeyDown,
    className,
    placeholder,
    error,
}) {
    const { t } = useTranslation()
    return (
        <div className={`form-group mb-3 ${className}`}>
            {
                label !== undefined
                && <label className="form-label fw-bold">{label}</label>
            }
            <textarea className="form-control" disabled={disabled} name={name} rows={rows} value={value ?? ""} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder ?? t("common.text.inputName", { name: label })} />
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    );
}
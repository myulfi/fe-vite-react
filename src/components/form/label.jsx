export default function Label({
    text,
    value,
    copy = false,
    className,
}) {
    const onCopy = value => navigator.clipboard.writeText(value)
    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{text}</label>
            <label className="col-12">
                {value}
                {
                    copy
                    && <>
                        &nbsp;<i className="pl-1 bi-copy" role="button" onClick={() => onCopy(value)} />
                    </>
                }
            </label>
        </div>
    );
}
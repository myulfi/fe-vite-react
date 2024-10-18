import './filter.css'

export default function Filter({
    label,
    icon = "bi-search",
    className = "col-xs-12",
    delay = 1,
    children,
}) {
    return (
        <div className={`${className} fade-in-delay-${delay} mb-4`} style={{ zIndex: 990 + (10 - delay), position: "relative" }}>
            <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                    <div className="col-xs-12">
                        <h5 className="card-title"><span className={icon}>&nbsp;{label}</span></h5>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default function Navtab({
    name = "",
    tabArray,
    initialActiveTab = 0
}) {
    return (
        <>
            <ul className="nav nav-tabs" role="presentation">
                {
                    tabArray.map((tab, index) => (
                        <li key={index} className="nav-item">
                            <a className={`nav-link nav_item_${name} ${index === initialActiveTab ? 'active' : null}`} data-bs-toggle="tab" id={`nav_item_${name}_menu${index}`} href={`#tab_pane_${name}_menu${index}`}>{tab.label}</a>
                        </li>
                    ))
                }
            </ul>
            <div className="tab-content mt-4">
                {
                    tabArray.map((tab, index) => (
                        <div key={index} className={`tab-pane tab_pane_${name} container ${index === initialActiveTab ? 'active' : 'fade'}`} id={`tab_pane_${name}_menu${index}`}>{tab.component()}</div>
                    ))
                }
            </div >
        </>
    )
}
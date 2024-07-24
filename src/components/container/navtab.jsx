export default function Navtab({
    tabArray
    , initialActiveTab = 0
}) {
    return (
        <>
            <ul className="nav nav-tabs" role="presentation">
                {
                    tabArray.map((tab, index) => (
                        <li key={index} className="nav-item">
                            <a className={`nav-link ${index === initialActiveTab ? 'active' : null}`} data-bs-toggle="tab" href={`#tab_menu${index}`}>{tab.label}</a>
                        </li>
                    ))
                }
            </ul>
            <div className="tab-content mt-4">
                {
                    tabArray.map((tab, index) => (
                        <div key={index} className={`tab-pane container ${index === initialActiveTab ? 'active' : 'fade'}`} id={`tab_menu${index}`} >{tab.component()}</div>
                    ))
                }
            </div >
        </>
    );
}
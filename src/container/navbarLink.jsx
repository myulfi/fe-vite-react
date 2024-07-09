import { Link } from "react-router-dom";

export default function NavbarLink({
    data
    , level
}) {
    return (
        <ul className={level === 0 ? "navbar-nav me-auto mb-2 mb-lg-0" : "dropdown-menu"}>
            {
                data.map((datum, index) => (
                    <li key={index} className={`nav-item ${datum.children !== undefined && datum.children.length > 0 ? "dropdown" : ""}`}>
                        {
                            datum.children === undefined
                            && <Link to={datum.path} className={level === 0 ? "nav-link" : "dropdown-item"}>{datum.name}</Link>
                        }
                        {
                            datum.children !== undefined && datum.children.length > 0
                            && <>
                                <a className={`${level === 0 ? "nav-link" : "dropdown-item"} dropdown-toggle`} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {datum.name}
                                </a>
                                <NavbarLink data={datum.children} level={level + 1} />
                            </>
                        }
                    </li>
                    // <li key={index} className={`nav-item ${datum.children !== undefined && datum.children.length > 0 ? "dropdown" : ""}`}>
                    //     <a className="nav-link" href={datum.path}>{datum.name}</a>
                    //     {
                    //         datum.children !== undefined && datum.children.length > 0
                    //         && <NavbarLink data={datum.children} level={level + 1} />
                    //     }
                    // </li>
                ))
            }
        </ul >
    );
}
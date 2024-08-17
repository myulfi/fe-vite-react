import { Link } from "react-router-dom";
import './navbarLink.css';

export default function NavbarLink({
    data
    , level
}) {
    return (
        <ul className={level === 0 ? "navbar-nav me-auto mb-2 mb-lg-0" : "dropdown-menu"}>
            {
                data.map((datum, index) => (
                    <li key={index} className={level < 1 ? (`nav-item ${datum.children?.length > 0 ? "dropdown" : null}`) : datum.children?.length > 0 ? "dropdown-submenu" : null}>
                        {
                            (datum.children === undefined || datum.children?.length === 0)
                            && <Link to={datum.path} className={level === 0 ? "nav-link" : "dropdown-item"}><i className={datum.icon} />&nbsp;{datum.name}</Link>
                        }
                        {
                            datum.children?.length > 0
                            && <>
                                <a className={`${level === 0 ? "nav-link" : "dropdown-item"} dropdown-toggle`} role={level === 0 ? "button" : null} data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className={datum.icon} />&nbsp;{datum.name}
                                </a>
                                <NavbarLink data={datum.children} level={level + 1} />
                            </>
                        }
                    </li>
                ))
            }
        </ul>
    );
}
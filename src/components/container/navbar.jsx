import NavbarLink from "./navbarLink";
import './navbar.css';
import { Link } from "react-router-dom";
import { apiRequest } from "../../api";
import { METHOD_IS_POST } from "../../constants/commonConstants";


export default function Navbar({
    data
}) {
    const doLogout = async (e) => {
        try {
            await apiRequest(METHOD_IS_POST, '/remove-token.json')
        } catch (error) {

        } finally {
            localStorage.removeItem("accessToken");
            window.location.reload(false);
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm border border-top-0">
            <div className="container">
                <Link to="/" className="navbar-brand"><span className="bi-umbrella">&nbsp;FE-VITE</span></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <NavbarLink data={data} level={0} />
                    <div className="d-flex">
                        <button className="btn btn-outline-dark" type="button" onClick={() => doLogout()}><span className="bi-arrow-right-square">&nbsp;&nbsp;Logout</span></button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
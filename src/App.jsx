//import Link from react router dom
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

//import routes
import Routes from './routers';
import Navbar from "./components/container/navbar";
import Footer from "./components/container/footer";
import Login from "./views/login";
import { apiRequest } from "./api";
import * as CommonConstants from "./constants/commonConstants";

export default function App() {
    const [menuList, setMenuList] = useState([]);

    const getMenu = async () => {
        if (localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN) !== null) {
            try {
                const response = await apiRequest(CommonConstants.METHOD.GET, "/main/menu.json")
                setMenuList(response.data.data)
            } catch (error) { }
        }
    }
    useEffect(() => { getMenu(); }, []);

    document.title = import.meta.env.VITE_APP_TITLE;
    return (
        <>
            {
                localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN) !== null
                && <>
                    <Navbar data={menuList} />
                    <Routes />
                    <Footer />
                </>
            }
            {
                localStorage.getItem("accessToken") === null
                && <Login />
            }
        </>
    )
}
import { useEffect, useState } from "react"
import Routes from "./routers"
import Navbar from "./components/container/navbar"
import Footer from "./components/container/footer"
import Login from "./views/login"
import { apiRequest } from "./api"
import Cookies from "js-cookie"
import * as CommonConstants from "./constants/commonConstants"
import { useTranslation } from "react-i18next"

export default function App() {
    const { i18n } = useTranslation();
    const [menuList, setMenuList] = useState([]);

    const getMenu = async () => {
        if (localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN) !== null) {
            try {
                const response = await apiRequest(CommonConstants.METHOD.GET, "/main/menu.json")
                setMenuList(response.data.data)
            } catch (error) { }
        }
    }
    useEffect(() => {
        i18n.changeLanguage(Cookies.get(CommonConstants.COOKIES.LANGUAGE) ?? "en")
        getMenu()
    }, []);

    document.title = import.meta.env.VITE_APP_TITLE
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
                localStorage.getItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN) === null
                && <Login />
            }
        </>
    )
}
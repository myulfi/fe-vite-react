import { useTranslation } from "react-i18next"
import enFlag from "../../assets/flag/en.png"
import idFlag from "../../assets/flag/id.png"
import Cookies from "js-cookie"
import * as CommonConstants from "../../constants/commonConstants"

export default function Footer() {
    const { i18n } = useTranslation()

    const changeLanguage = (id) => {
        Cookies.set(CommonConstants.COOKIES.LANGUAGE, id)
        i18n.changeLanguage(id)
    }

    return (
        <footer className="footer mt-auto py-3 bg-light border border-bottom-0">
            <div className="container">
                <div className="d-flex">
                    <img className="border border-dark mx-2" role="button" style={{ width: "24px", height: "15px" }} src={enFlag} onClick={() => changeLanguage("en")} />
                    <img className="border border-dark mx-2" role="button" style={{ width: "24px", height: "15px" }} src={idFlag} onClick={() => changeLanguage("id")} />
                    <span className="text-muted ms-auto">&copy;&nbsp;2024.</span>
                </div>
            </div>
        </footer>
    )
}
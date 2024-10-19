import "./login.css"
import logo from "../assets/react.svg"
import { useState } from "react"
import { apiRequest } from "../api"
import * as CommonConstants from "../constants/commonConstants"
import { useTranslation } from "react-i18next"

export default function Login() {
    const { t } = useTranslation()
    const loginInitial = {
        username: '',
        password: '',
    }

    const [loginForm, setLoginForm] = useState(loginInitial)
    const [loginFormError, setLoginFormError] = useState([])
    const [loginLoadingFlag, setLoginLoadingFlag] = useState(false)

    const onLoginFormChange = (e) => {
        const { name, value } = e.target
        setLoginForm({ ...loginForm, [name]: value })
        setLoginFormError(null)
    };

    const loginValidate = (data) => {
        let error = null;
        if (!data.username.trim() || data.username.trim().length === 0) error = t("validate.text.required", { name: t("common.text.username") })
        else if (!data.password.trim() || data.password.trim().length === 0) error = t("validate.text.required", { name: t("common.text.password") })
        setLoginFormError(error)
        return error == null
    };

    const doLogin = async (e) => {
        e.preventDefault()
        if (loginValidate(loginForm)) {
            setLoginLoadingFlag(true)

            try {
                const response = await apiRequest(
                    CommonConstants.METHOD.POST,
                    '/generate-token.json',
                    JSON.stringify({
                        username: btoa(unescape(encodeURIComponent(
                            btoa(unescape(encodeURIComponent(
                                btoa(unescape(encodeURIComponent(
                                    loginForm.username
                                )))
                            )))
                        ))),
                        password: btoa(unescape(encodeURIComponent(
                            btoa(unescape(encodeURIComponent(
                                btoa(unescape(encodeURIComponent(
                                    btoa(unescape(encodeURIComponent(
                                        loginForm.password
                                    )))
                                )))
                            )))
                        )))
                    })
                )

                if (response.data.status === "success") {
                    localStorage.setItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN, response.data.data.token);
                    window.location.reload(false);
                } else {
                    setLoginFormError(response.data.message);
                }
            } catch (error) {
                setLoginFormError(error);
            } finally {
                setLoginLoadingFlag(false);
            }
        }
    }

    return (
        <main className="form-signin text-center">
            <form>
                <img className="mb-4" src={logo} alt="" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">{t("common.text.pleaseSignIn")}</h1>

                <div className="form-floating">
                    <input type="username" className="form-control" id="floatingInput" name="username" value={loginForm.username} onChange={onLoginFormChange} placeholder=" " />
                    <label htmlFor="floatingInput">{t("common.text.username")}</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" name="password" value={loginForm.password} onChange={onLoginFormChange} placeholder=" " />
                    <label htmlFor="floatingPassword">{t("common.text.password")}</label>
                </div>
                <button type="submit" className="w-100 btn btn-lg btn-primary" disabled={loginLoadingFlag} onClick={(e) => doLogin(e)}>
                    <span className={loginLoadingFlag ? "spinner-grow spinner-grow-sm mx-2" : null} role="status" aria-hidden="true" />
                    <span className="bi-arrow-right-square">&nbsp;&nbsp;{t("common.button.login")}</span>
                </button>
                {loginFormError && <div className="form-floating mt-3 text-danger">{loginFormError}</div>}
                <p className="mt-5 mb-3 text-muted">&copy;&nbsp;2024</p>
            </form>
        </main>
    )
}
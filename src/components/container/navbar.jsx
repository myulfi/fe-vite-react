import NavbarLink from "./navbarLink"
import "./navbar.css"
import { Link } from "react-router-dom"
import { apiRequest } from "../../api"
import * as CommonConstants from "../../constants/commonConstants"
import { useEffect } from "react"

export default function Navbar({
    data
}) {
    const { t } = useTranslation()
    const [changePasswordButtonLoadingFlag, setChangePasswordButtonLoadingFlag] = useState(false)

    const changePasswordInitial = {
        oldPassword: "",
        newPassword: "",
    }
    const [changePasswordForm, setChangePasswordForm] = useState(changePasswordInitial)
    const [changePasswordFormError, setChangePasswordFormError] = useState([])

    const onChangePasswordFormChange = (e) => {
        const { name, value } = e.target
        setChangePasswordForm({
            ...changePasswordForm,
            [name]: value
        })
    }

    const changePasswordValidate = (data) => {
        const error = {}
        if (!data.oldPassword) error.oldPassword = t("validate.text.required", { name: t("common.text.oldPassword") })
        if (!data.newPassword) error.newPassword = t("validate.text.required", { name: t("common.text.newPassword") })
        setChangePasswordFormError(error)
        return Object.keys(error).length === 0
    }

    const doLogout = async (e) => {
        try {
            await apiRequest(CommonConstants.METHOD.POST, '/remove-token.json')
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            localStorage.removeItem(CommonConstants.LOCAL_STORAGE.ACCESS_TOKEN)
            localStorage.removeItem(CommonConstants.LOCAL_STORAGE.NAME)
            window.location.reload(false)
        }
    }

    const [toast, setToast] = useState({})
    useEffect(() => {
        if (toast?.message !== undefined) {
            ToastHelper.show("toast_navbar")
        }
    }, [toast])

    useEffect(() => {
        if (dialog?.message !== undefined) {
            ModalHelper.show("dialog_navbar")
        }
    }, [dialog])

    const openChangePassword = () => ModalHelper.show("modal_change_password")

    const confirmChangePassword = () => {
        if (changePasswordValidate(changePasswordForm)) {
            setDialog({
                message: t("common.confirmation.changePassword"),
                type: "confirmation",
                onConfirm: (e) => storeChangePassword(e)
            })
        }
    }

    const storeChangePassword = async () => {
        if (changePasswordValidate(changePasswordForm)) {
            ModalHelper.hide("dialog_navbar")
            setChangePasswordButtonLoadingFlag(true)

            try {
                const json = await apiRequest(
                    CommonConstants.METHOD.PATCH, "/main/change-password.json",
                    JSON.stringify({
                        oldPassword: btoa(unescape(encodeURIComponent(
                            btoa(unescape(encodeURIComponent(
                                btoa(unescape(encodeURIComponent(
                                    btoa(unescape(encodeURIComponent(
                                        changePasswordForm.oldPassword
                                    )))
                                )))
                            )))
                        ))),
                        newPassword: btoa(unescape(encodeURIComponent(
                            btoa(unescape(encodeURIComponent(
                                btoa(unescape(encodeURIComponent(
                                    btoa(unescape(encodeURIComponent(
                                        changePasswordForm.newPassword
                                    )))
                                )))
                            )))
                        )))
                    })
                )

                if (json.data.status === "success") {
                    ModalHelper.hide("modal_change_password")
                }

                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setChangePasswordFormError(error.response?.data ?? [])
            } finally {
                setChangePasswordButtonLoadingFlag(false)
            }
        }
    }

    const generateLanguage = async () => {
        try {
            const json = await apiRequest(CommonConstants.METHOD.PUT, "/main/generate-language.json")
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            setChangePasswordFormError(error.response?.data ?? [])
        }
    }

    return (
        <Fragment>
            <Modal
                id="modal_change_password"
                size="sm"
                title={t("common.text.changePassword")}
                buttonArray={
                    <Button
                        label={t("common.button.update")}
                        onClick={() => confirmChangePassword()}
                        className="btn-primary"
                        icon="bi-arrow-repeat"
                        loadingFlag={changePasswordButtonLoadingFlag}
                    />
                }
            >
                <Fragment>
                    <InputPassword label={t("common.text.oldPassword")} name="oldPassword" value={changePasswordForm.oldPassword} onChange={onChangePasswordFormChange} className="col-md-12" error={changePasswordFormError.oldPassword} />
                    <InputPassword label={t("common.text.newPassword")} name="newPassword" value={changePasswordForm.newPassword} onChange={onChangePasswordFormChange} className="col-md-12" error={changePasswordFormError.newPassword} />
                </Fragment>
            </Modal>
            <Dialog id="dialog_navbar" type={dialog.type} message={dialog.message} onConfirm={dialog.onConfirm} />
            <Toast id="toast_navbar" type={toast.type} message={toast.message} />
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm border border-top-0">
                <div className="container">
                    <Link to="/" className="navbar-brand"><span className="bi-umbrella">&nbsp;{import.meta.env.VITE_APP_TITLE}</span></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <NavbarLink data={data} level={0} />
                    </div>
                    <div className="dropdown text-end">
                        <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            Hello&nbsp;<b>{localStorage.getItem(CommonConstants.LOCAL_STORAGE.NAME)}</b>
                            &nbsp;<div width="32" height="32" className="bg-dark rounded-circle p-3" />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownUser1">
                            <li><a className="dropdown-item" role="button" onClick={() => openChangePassword()}><span className="bi-person-lock" />&nbsp;{t("common.button.changePassword")}</a></li>
                            {/* <li><hr className="dropdown-divider" /></li> */}
                            {
                                localStorage.getItem(CommonConstants.LOCAL_STORAGE.ROLE).includes(0)
                                && <li><a className="dropdown-item" role="button" onClick={() => generateLanguage()}><span className="bi-translate" />&nbsp;{t("common.button.generateLanguage")}</a></li>
                            }
                            <li><a className="dropdown-item" role="button" onClick={() => doLogout()}><span className="bi-arrow-right-square" />&nbsp;{t("common.button.logout")}</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </Fragment>
    )
}
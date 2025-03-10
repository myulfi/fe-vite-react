import { useTranslation } from "react-i18next"

export default function Modal({
    id = "modal_id",
    size = "xl",
    title = "Form",
    loadingFlag = false,
    mediumTitle,
    smallTitle,
    buttonArray,
    children,
}) {
    const { t } = useTranslation()
    return (
        <div id={id} className="modal fade bg-dark bg-opacity-75" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
            aria-labelledby="staticBackdropLabel">
            <div className={`modal-dialog modal-${size}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <strong>{title}</strong>
                            {
                                smallTitle && <><br /><small><small>{smallTitle}</small></small></>
                            }
                            {
                                mediumTitle && <><br /><small>{mediumTitle}</small></>
                            }
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {
                            loadingFlag === true
                            && <div className="row d-flex align-items-center justify-content-center">
                                <div class="spinner-border" style={{ width: "10rem", height: "10rem" }} role="status"></div>
                            </div>
                        }
                        {
                            loadingFlag === false
                            && <div className="row app-padding-row mx-1">
                                {children}
                            </div>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-secondary m-1" data-bs-dismiss="modal">
                            <span className="bi-x-lg">&nbsp;{t("common.button.close")}</span>
                        </button>
                        {buttonArray}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default function Modal({
    id = "modal_id"
    , size = "xl"
    , title = "Form"
    , buttonArray
    , children
}) {
    return (
        <div id={id} className="modal fade bg-dark bg-opacity-75" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className={`modal-dialog modal-${size}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-uppercase">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row">
                                {children}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-secondary m-1" data-bs-dismiss="modal">
                            <span className="bi-x-lg">&nbsp;Close</span>
                        </button>
                        {
                            buttonArray !== undefined
                            && buttonArray.map((button, index) => (
                                <div key={index}>
                                    <button type="button" className="btn btn-sm btn-primary m-1" disabled={button.isLoading ? "disabled" : ""} onClick={() => button.onSubmit()}>
                                        <span className={button.isLoading ? "spinner-grow spinner-grow-sm mx-2" : ""} role="status" aria-hidden="true" />
                                        <span className={button.icon}>&nbsp;{button.label}</span>
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
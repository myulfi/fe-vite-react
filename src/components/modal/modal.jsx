export default function Modal({
    id
    , size
    , title
    , labelSubmit
    , iconSubmit
    , onSubmit
    , isSubmitLoading
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
                        <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                            <span className="bi-x-lg">&nbsp;Close</span>
                        </button>
                        <button type="button" className="btn btn-sm btn-primary" disabled={isSubmitLoading ? "disabled" : ""} onClick={() => onSubmit()}>
                            <span className={isSubmitLoading ? "spinner-grow spinner-grow-sm" : ""} role="status" aria-hidden="true" />
                            <span className={iconSubmit}>&nbsp;{labelSubmit}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
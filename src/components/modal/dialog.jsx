export default function Dialog({
    id
    , message
    , type
    , onConfirm
}) {
    let titleSpan;
    if (type === "confirmation") titleSpan = "bg-primary";
    else if (type === "warning") titleSpan = "bg-danger";
    else if (type === "alert") titleSpan = "bg-warning";
    else titleSpan = "bg-dark";

    return (
        <div id={id} className="modal fade bg-dark bg-opacity-75" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <span className={`placeholder px-3 p-3 rounded me-2 ${titleSpan}`}></span>
                        <h5 className="modal-title text-uppercase">{type}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">{message}</div>
                    <div className="modal-footer">
                        {
                            type === "alert"
                            && <button type="button" className="btn btn-sm btn-warning px-4" data-bs-dismiss="modal">
                                <span className="bi-sun">&nbsp;UNDERSTOOD</span>
                            </button>
                        }
                        {
                            type !== "alert"
                            && <button type="button" className="btn btn-sm btn-secondary px-4 " data-bs-dismiss="modal">
                                <span className="bi-x-lg">&nbsp;CLOSE</span>
                            </button>
                        }
                        {
                            type === "confirmation"
                            && <button type="button" className="btn btn-sm btn-primary px-4 " onClick={() => onConfirm()}>
                                <span className="bi-check-circle">&nbsp;OK</span>
                            </button>
                        }
                        {
                            type === "warning"
                            && <button type="button" className="btn btn-sm btn-danger px-4 " onClick={() => onConfirm()}>
                                <span className="bi-check-circle">&nbsp;&nbsp;OF COURSE</span>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default function Toast({
    id = "toast_id"
    , type = "success"
    , message = "Message"
}) {
    return (
        <div className="toast-container position-fixed p-3 top-0 end-0">
            <div id={id} className={`toast align-items-center text-white bg-${type === "success" ? "success" : "danger"} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {message}
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    )
}
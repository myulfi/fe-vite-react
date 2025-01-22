export default function Label({
    text,
    value,
    copy = false,
    className,
}) {
    const onCopy = (e, value) => {
        const div = document.createElement("div")
        div.innerHTML = value
        document.body.appendChild(div)
        const range = document.createRange()
        range.selectNode(div)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        document.execCommand("copy")
        window.getSelection().removeAllRanges()
        document.body.removeChild(div)

        const tooltip = document.createElement("div")
        tooltip.innerHTML = `${value} copied`
        tooltip.style.opacity = 0.8;
        tooltip.style.left = `${e.pageX + 10}px`
        tooltip.style.top = `${e.pageY + 10}px`
        tooltip.style.position = "absolute"
        tooltip.style.backgroundColor = "#333"
        tooltip.style.color = "#FFF"
        tooltip.style.padding = "7px"
        tooltip.style.borderRadius = "5px"
        tooltip.style.fontSize = "12px"
        tooltip.style.transition = "opacity 0.3s"
        tooltip.style.pointerEvents = "none"
        tooltip.style.zIndex = 99999
        document.body.appendChild(tooltip)

        setTimeout(() => {
            document.body.removeChild(tooltip)
        }, 1000)
    }

    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{text}</label>
            <label className="col-12">
                {value}
                {
                    copy
                    && <>
                        &nbsp;<i className="pl-1 bi-copy" role="button" onClick={(e) => onCopy(e, value)} />
                    </>
                }
            </label>
        </div>
    );
}
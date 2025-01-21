import Href from "../form/href"
import { Fragment } from "react"

export default function BreadCrumb({
    label,
    valueList,
    delimiter = "&nbsp;",
    onClick,
    onEdit
}) {
    const onCopy = value => navigator.clipboard.writeText(value)
    return (
        <div className={`form-group mb-3 pt-3`}>
            {
                valueList.length > 1
                && valueList.map((name, index) => (
                    <Fragment key={index}>
                        {
                            index > 0
                            && <>&nbsp;{delimiter}&nbsp;</>
                        }
                        {
                            index === valueList.length - 1
                            && <b>{name}</b>
                        }
                        {
                            index < valueList.length - 1
                            && <Href label={name.length > 0 ? name : "..."} onClick={() => onClick(index)}></Href>
                        }
                    </Fragment>
                ))
            }
            {
                valueList.length === 1
                && <b>...</b>
            }
            &nbsp;&nbsp;<span className="bi-pencil" role="button" onClick={onEdit} />
            &nbsp;&nbsp;<span className="bi-copy" role="button" onClick={() => onCopy(valueList.join(delimiter))} />
        </div>
    )
}
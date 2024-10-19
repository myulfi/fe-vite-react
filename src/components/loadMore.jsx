import { useEffect, useState } from "react"
import { Fragment } from "react"
import "./table.css"
import * as CommonConstants from "../constants/commonConstants"
import { getNestedValue } from "../function/commonHelper"
import { useTranslation } from "react-i18next"

export default function LoadMore({
    labelNewButton,
    onNewButtonClick = () => { alert("Please define your function!") },
    bulkOptionLoadingFlag = false,
    bulkOptionArray,
    loadArray = [],
    columns,
    order = [],
    checkBoxArray,
    onCheckBox = () => { alert("Please define your function!") },
    initialSizePage = 10,
    filter,
    onRender,
    loadingFlag = false,
}) {
    const { t } = useTranslation()
    const [loadMoreButtonFlag, setLoadMoreButtonFlag] = useState(true)
    const [dataArray, setDataArray] = useState(loadArray)
    useEffect(() => {
        setDataArray([...dataArray, ...loadArray])
        setLoadMoreButtonFlag(loadArray.length == sizePage)
    }, [loadArray])

    const checkBoxStateArray = dataArray.map(function (obj) {
        return obj['id']
    })

    const columnShow = columns.filter(column => { return column.minDevice !== CommonConstants.NONE })
    const columnHide = columns.filter(column => { return column.minDevice !== undefined && column.minDevice !== CommonConstants.MOBILE })
    const columnAlwaysHide = columns.filter(column => { return column.minDevice === CommonConstants.NONE })

    const [search, setSearch] = useState("")
    const [currentOrder, setCurrentOrder] = useState(order)
    const [orderColumn, setOrderColumn] = useState([])
    const [detailRow, setDetailRow] = useState(dataArray.map(() => false))

    const [currentPage, setCurrentPage] = useState(1)
    const [sizePage, setSizePage] = useState(initialSizePage)

    const lengthArray = [5, 10, 25, 50, 100]

    useEffect(() => {
        if (orderColumn.length === 0) {
            var array = new Array()
            for (var i = 0; i < columnShow.length; i++) {
                array.push(columnShow[i].orderable ? "bi-three-dots-vertical" : null)
            }

            if (order.length > 0) {
                for (var i = 0; i < order.length; i++) {
                    if ("asc" === order[i][1]) {
                        array[order[i][0]] = "bi-sort-down-alt"
                        setCurrentOrder([columnShow[order[i][0]]["data"], "asc"])
                        onRender(currentPage, sizePage, search, [columnShow[order[i][0]]["data"], "asc"])
                        break
                    } else if ("desc" === order[i][1]) {
                        array[order[i][0]] = "bi-sort-down"
                        setCurrentOrder([columnShow[order[i][0]]["data"], "desc"])
                        onRender(currentPage, sizePage, search, [columnShow[order[i][0]]["data"], "desc"])
                        break
                    }
                }
            } else {
                onRender(currentPage, sizePage, search)
            }
            setOrderColumn(array)
        } else {
            onPageChange(1, sizePage, search)
        }
    }, [filter])

    const onPageChange = (page, length, search) => {
        if (page === 1) {
            setDataArray([])
        }
        setCurrentPage(page)
        setSizePage(length)
        setDetailRow(dataArray.map(() => false))
        onRender(page, length, search, currentOrder)
    }

    const onPageLoad = (page, length, search) => {
        setCurrentPage(page)
        setSizePage(length)
        setDetailRow(dataArray.map(() => false))
        onRender(page, length, search, currentOrder)
    }

    const onOrderChange = (data, index) => {
        var array = new Array()
        for (var i = 0; i < orderColumn.length; i++) {
            if (index === i) {
                setDetailRow(dataArray.map(() => false))
                if (orderColumn[i] === "bi-sort-down") {
                    array.push("bi-sort-down-alt")
                    setCurrentOrder([data, "asc"])
                    onRender(currentPage, sizePage, search, [data, "asc"])
                } else {
                    array.push("bi-sort-down")
                    setCurrentOrder([data, "desc"])
                    onRender(currentPage, sizePage, search, [data, "desc"])
                }
            } else {
                array.push(orderColumn[i] !== null ? "bi-three-dots-vertical" : null)
            }
        }
        setOrderColumn(array)
    }

    const onCheckBoxAll = () => {
        const currentCheckBoxStateArray = checkBoxStateArray.length
        const currentCheckBoxArray = dataArray.filter(datum => checkBoxArray.includes(datum.id)).length
        dataArray.forEach(function (dataArray) {
            if (currentCheckBoxStateArray !== currentCheckBoxArray) {
                if (checkBoxArray.includes(dataArray.id) === false) {
                    checkBoxArray.push(dataArray.id)
                }
            } else {
                if (checkBoxArray.includes(dataArray.id)) {
                    checkBoxArray.splice(checkBoxArray.indexOf(dataArray.id), 1)
                }
            }
        })

        onCheckBox(checkBoxArray)
    }

    const onCheckBoxSingle = (id) => {
        if (checkBoxArray.includes(id)) {
            checkBoxArray.splice(checkBoxArray.indexOf(id), 1)
        } else {
            checkBoxArray.push(id)
        }

        onCheckBox(checkBoxArray)
    }

    const showDetail = (index) => {
        setDetailRow({ ...detailRow, [index]: !detailRow[index] })
    }

    return (
        <>
            <div>
                <div className="clearfix">
                    {
                        labelNewButton != undefined
                        && <div className="float-sm-start d-grid d-sm-flex mb-2">
                            <button className="btn btn-md btn-primary rounded border-0 shadow-sm" type="button" onClick={() => onNewButtonClick()}>
                                <span className="bi-plus-circle">&nbsp;{labelNewButton}</span>
                            </button>
                        </div>
                    }
                    {
                        bulkOptionArray !== undefined
                        && <div className="float-sm-end d-grid d-sm-flex mb-2">
                            <div className="btn-group">
                                <button className="btn btn-outline-dark shadow-sm dropdown-toggle" disabled={bulkOptionLoadingFlag} data-bs-toggle="dropdown">
                                    <span className={bulkOptionLoadingFlag ? "spinner-border spinner-border-sm mx-2" : null} role="status" aria-hidden="true" />
                                    <span className="bi-stack">&nbsp;{checkBoxArray?.length > 0 ? `(${checkBoxArray?.length}) ` : null}{t("common.button.bulkOption")}</span>
                                </button>
                                <div className="dropdown-menu">
                                    {bulkOptionArray}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="clearfix">
                    <div className="float-sm-start mb-2">
                        Show&nbsp;<select className="p-1" value={sizePage} onChange={(e) => onPageChange(1, e.target.value, search)}>
                            {
                                lengthArray.map((length) => (
                                    <option value={length} key={length}>{length}</option>
                                ))
                            }
                        </select>&nbsp;entires
                    </div>
                    <div className="float-sm-end d-grid d-sm-flex mb-2">
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            placeholder="Search"
                            className="form-control form-control-sm"
                            onChange={event => setSearch(event.target.value)}
                            onKeyDown={event => { if (event.key === "Enter") { onPageChange(1, sizePage, search) } }}
                        />
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                {
                    loadingFlag && dataArray.length === 0 && <div className="spinner-border text-primary position-absolute top-50 start-50"></div>
                }
                <table className="table table-bordered table-hover my-1 align-middle">
                    <thead className="border border-bottom-0">
                        <tr>
                            {
                                checkBoxArray != undefined
                                && <th scope="col" className="text-center">
                                    <span
                                        className={dataArray.filter(datum => checkBoxArray.includes(datum.id)).length === 0 ? 'bi-square' : dataArray.filter(datum => checkBoxArray.includes(datum.id)).length === checkBoxStateArray.length ? 'bi-plus-square-fill' : 'bi-dash-square-fill'}
                                        role="button" onClick={() => onCheckBoxAll()}></span>
                                </th>
                            }
                            {
                                columnShow.map((column, index) => (
                                    <th key={index} scope="col" className={`${column.class} ${column.minDevice == CommonConstants.DESKTOP ? "min-desktop" : column.minDevice == CommonConstants.TABLET ? "min-tablet" : ""}`} width={column.width != null ? `${column.width}%` : null}>
                                        {column.name}
                                        {
                                            orderColumn[index] != null &&
                                            <i className={`float-end ${orderColumn[index]}`} role="button" onClick={() => onOrderChange(column.data, index)}></i>
                                        }
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataArray.length > 0
                                ?
                                dataArray.map((data, indexRow) => (
                                    <Fragment key={indexRow}>
                                        <tr>
                                            {
                                                checkBoxArray != undefined
                                                && <td className="text-center">
                                                    <span className={checkBoxArray.indexOf(data.id) >= 0 ? 'bi-check-square-fill' : 'bi-square'}
                                                        role="button" onClick={() => onCheckBoxSingle(data.id)}></span>
                                                </td>
                                            }
                                            {
                                                columnShow
                                                    .map((column, index) => (
                                                        <td key={index} className={`${column.class} ${column.minDevice == CommonConstants.DESKTOP ? "min-desktop" : column.minDevice == CommonConstants.TABLET ? "min-tablet" : ""}`} role={index == 0 && columnAlwaysHide.length > 0 ? "button" : null} onClick={index === 0 ? () => showDetail(indexRow) : null}>
                                                            {
                                                                index == 0 &&
                                                                <span className={`${detailRow[indexRow] ? "bi-dash-circle-fill" : "bi-plus-circle-fill"} text-primary me-2 ${columnAlwaysHide.length === 0 ? "max-desktop" : null}`} />
                                                            }
                                                            {
                                                                column.render != undefined
                                                                    ? column.render(data[column.data], data)
                                                                    : getNestedValue(data, column.data)
                                                            }
                                                        </td>
                                                    ))
                                            }
                                        </tr>
                                        {
                                            columnHide.length > 0 && detailRow[indexRow] &&
                                            <tr className={columnAlwaysHide.length === 0 ? "max-desktop" : null}>
                                                <td colSpan={columnShow.length + (checkBoxArray != undefined ? 1 : 0)}>
                                                    {
                                                        columnHide
                                                            .map((column, index) => (
                                                                <div key={index} className={`border-bottom mx-2 px-2 py-2 ${column.minDevice == CommonConstants.TABLET ? "max-tablet" : column.minDevice == CommonConstants.DESKTOP ? "max-desktop" : ""}`}>
                                                                    <label className="fw-bold me-2">{column.name}</label>
                                                                    {
                                                                        column.render != undefined
                                                                            ? column.render(data[column.data], data)
                                                                            : getNestedValue(data, column.data)
                                                                    }
                                                                </div>
                                                            ))
                                                    }
                                                </td>
                                            </tr >
                                        }
                                    </Fragment>
                                ))

                                : <tr>
                                    <td colSpan={columnShow.length + (checkBoxArray != undefined ? 1 : 0)} className="text-center">
                                        {t("datatable.text.emptyTable")}
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            {
                dataArray.length > 0
                && <Fragment>
                    <div className="mt-2">
                        {dataArray.length} row(s)
                    </div>
                    {
                        loadMoreButtonFlag
                        && <div className="text-center mt-2">
                            <button className="btn btn-md btn-primary rounded border-0 shadow-sm" disabled={loadingFlag} type="button" onClick={() => onPageLoad(currentPage + 1, sizePage, search)}>
                                <span className={loadingFlag ? "spinner-border spinner-border-sm mx-2" : null} role="status" aria-hidden="true" />
                                <span className="bi-arrow-down-circle">&nbsp;&nbsp;{t("common.button.loadMore")}</span>
                            </button>
                        </div>
                    }
                </Fragment>
            }
        </>
    )
}
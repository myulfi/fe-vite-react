import { useEffect, useState } from "react"
import { Fragment } from "react"
import "./table.css"
import * as CommonConstants from "../constants/commonConstants"
import { getNestedValue } from "../function/commonHelper"
import { useTranslation, Trans } from "react-i18next"
import Dropdown from "./dropdown"

export default function Table({
    showFlag = true,
    type = CommonConstants.TABLE.PAGINATION,
    labelNewButton,
    onNewButtonClick = () => { alert("Please define your function!") },
    additionalButtonArray = [],
    bulkOptionLoadingFlag = false,
    bulkOptionArray = [],
    lengthFlag = true,
    searchFlag = true,
    dataArray = [],
    columns,
    order = [],
    checkBoxArray,
    onCheckBox = () => { alert("Please define your function!") },
    dataTotal = 0,
    initialSizePage = 10,
    limitPaginationButton = 7,
    filter,
    onRender,
    loadingFlag = false,
}) {
    const { t } = useTranslation()
    const [loadMoreButtonFlag, setLoadMoreButtonFlag] = useState(true)
    const [itemArray, setItemArray] = useState(dataArray)

    useEffect(() => {
        if (CommonConstants.TABLE.PAGINATION === type) {
            setItemArray(dataArray)
        } else if (CommonConstants.TABLE.LOAD_MORE === type) {
            setItemArray([...itemArray, ...dataArray])
            setLoadMoreButtonFlag(dataArray.length == sizePage)
        }
    }, [dataArray])

    const checkBoxStateArray = itemArray.map(function (obj) {
        return obj['id']
    })

    const columnShow = columns.filter(column => { return column.minDevice !== CommonConstants.DEVICE.NONE })
    const columnHide = columns.filter(column => { return column.minDevice !== undefined && column.minDevice !== CommonConstants.DEVICE.MOBILE })
    const columnAlwaysHide = columns.filter(column => { return column.minDevice === CommonConstants.DEVICE.NONE })

    const [search, setSearch] = useState("")
    const [currentOrder, setCurrentOrder] = useState(order)
    const [orderColumn, setOrderColumn] = useState([])
    const [detailRow, setDetailRow] = useState(itemArray.map(() => false))

    const [currentPage, setCurrentPage] = useState(1)
    const [sizePage, setSizePage] = useState(initialSizePage)

    const pages = Array.from({ length: Math.ceil(dataTotal / sizePage) }, (_, i) => i + 1)
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
        if (CommonConstants.TABLE.LOAD_MORE === type && page === 1) {
            setItemArray([])
        }
        setCurrentPage(page)
        setSizePage(length)
        setDetailRow(itemArray.map(() => false))
        onRender(page, length, search, currentOrder)
    }

    const onPageLoadMore = (page, length, search) => {
        setCurrentPage(page)
        setSizePage(length)
        setDetailRow(itemArray.map(() => false))
        onRender(page, length, search, currentOrder)
    }

    const onOrderChange = (data, index) => {
        var array = new Array()
        for (var i = 0; i < orderColumn.length; i++) {
            if (index === i) {
                setDetailRow(itemArray.map(() => false))
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
        const currentCheckBoxArray = itemArray.filter(datum => checkBoxArray.includes(datum.id)).length
        itemArray.forEach(function (itemArray) {
            if (currentCheckBoxStateArray !== currentCheckBoxArray) {
                if (checkBoxArray.includes(itemArray.id) === false) {
                    checkBoxArray.push(itemArray.id)
                }
            } else {
                if (checkBoxArray.includes(itemArray.id)) {
                    checkBoxArray.splice(checkBoxArray.indexOf(itemArray.id), 1)
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

    const paginationRange = (len, start) => {
        var end

        if (start === undefined) {
            start = 1
            end = len
        } else {
            end = start
            start = len
        }

        var out = []
        for (var i = start; i <= end; i++) { out.push(i) }
        return out
    }

    const paginationButton = (currentPage, pageAmount, limitButton) => {
        const halfLimitButon = Math.floor(limitButton / 2)
        var buttonArray
        if (pageAmount <= limitButton) {
            buttonArray = paginationRange(1, pageAmount)
        } else if (currentPage <= halfLimitButon) {
            buttonArray = paginationRange(1, limitButton)
            buttonArray[limitButton - 2] = "..."
            buttonArray[limitButton - 1] = pageAmount
        } else if (currentPage >= pageAmount - halfLimitButon) {
            buttonArray = paginationRange(pageAmount - limitButton + 1, pageAmount)
            buttonArray[0] = 1
            buttonArray[1] = "..."
        } else {
            buttonArray = paginationRange(currentPage - halfLimitButon, currentPage + halfLimitButon)
            buttonArray[0] = 1
            buttonArray[1] = "..."
            buttonArray[limitButton - 2] = "..."
            buttonArray[limitButton - 1] = pageAmount
        }

        return buttonArray
    }

    return (
        <div className={showFlag ? "d-block" : "d-none"}>
            <div>
                <div className="clearfix">
                    {
                        labelNewButton != undefined
                        && <div className="float-sm-start d-grid d-sm-flex mb-2 me-sm-3">
                            <button className="btn btn-md btn-primary rounded border-0 shadow-sm" type="button" onClick={() => onNewButtonClick()}>
                                <span className="bi-plus-circle">&nbsp;{labelNewButton}</span>
                            </button>
                        </div>
                    }
                    {
                        additionalButtonArray.length > 0
                        && additionalButtonArray.map((additionalButton, index) => (
                            <div key={index} className="float-sm-start d-grid d-sm-flex mb-2 me-sm-3">
                                <button className="btn btn-md btn-primary rounded border-0 shadow-sm" disabled={additionalButton.loadingFlag} type="button" onClick={() => additionalButton.onClick()}>
                                    <span className={additionalButton.loadingFlag ? "spinner-grow spinner-grow-sm mx-2" : null} role="status" aria-hidden="true" />
                                    <span className={additionalButton.icon}>&nbsp;{additionalButton.label}</span>
                                </button>
                            </div>
                        ))
                    }
                    {
                        bulkOptionArray.length > 0
                        && <div className="float-sm-end d-grid d-sm-flex mb-2">
                            <div className="btn-group">
                                <button className="btn btn-outline-dark shadow-sm dropdown-toggle" disabled={bulkOptionLoadingFlag} data-bs-toggle="dropdown">
                                    <span className={bulkOptionLoadingFlag ? "spinner-border spinner-border-sm mx-2" : null} role="status" aria-hidden="true" />
                                    <span className="bi-stack">&nbsp;{checkBoxArray?.length > 0 ? `(${checkBoxArray?.length}) ` : null}{t("common.button.bulkOption")}</span>
                                </button>
                                <div className="dropdown-menu">
                                    {
                                        bulkOptionArray.map((bulkOption, index) => (
                                            <Dropdown key={index} label={bulkOption.label} icon={bulkOption.icon} onClick={() => bulkOption.onClick()}></Dropdown>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="clearfix">
                    {
                        lengthFlag
                        && <div className="float-sm-start mb-2">
                            <Trans
                                i18nKey="datatable.text.lengthMenu"
                                components={{
                                    menu: <select className="p-1" value={sizePage} onChange={(e) => onPageChange(1, e.target.value, search)}>
                                        {
                                            lengthArray.map((length) => (
                                                <option value={length} key={length}>{length}</option>
                                            ))
                                        }
                                    </select>
                                }}
                            />
                        </div>
                    }
                    {
                        searchFlag
                        && <div className="float-sm-end d-grid d-sm-flex mb-2">
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                placeholder={t("common.text.search")}
                                className="form-control form-control-sm"
                                onChange={event => setSearch(event.target.value)}
                                onKeyDown={event => { if (event.key === "Enter") { onPageChange(1, sizePage, search) } }}
                            />
                        </div>
                    }
                </div>
            </div>
            <div className="table-responsive">
                {
                    loadingFlag
                    && (
                        CommonConstants.TABLE.PAGINATION === type
                        || (CommonConstants.TABLE.LOAD_MORE === type && itemArray.length === 0)
                    )
                    && <div className="spinner-border text-primary position-absolute top-50 start-50"></div>
                }
                <table className="table table-bordered table-hover my-1 align-middle">
                    <thead className="border border-bottom-0">
                        <tr>
                            {
                                checkBoxArray != undefined
                                && <th scope="col" className="text-center">
                                    <span
                                        className={itemArray.filter(datum => checkBoxArray.includes(datum.id)).length === 0 ? 'bi-square' : itemArray.filter(datum => checkBoxArray.includes(datum.id)).length === checkBoxStateArray.length ? 'bi-plus-square-fill' : 'bi-dash-square-fill'}
                                        role="button" onClick={() => onCheckBoxAll()}></span>
                                </th>
                            }
                            {
                                columnShow.map((column, index) => (
                                    <th key={index} scope="col" className={`${column.class} ${column.minDevice == CommonConstants.DEVICE.DESKTOP ? "min-desktop" : column.minDevice == CommonConstants.DEVICE.TABLET ? "min-tablet" : ""}`} width={column.width != null ? `${column.width}%` : null}>
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
                            itemArray.length > 0
                                ? itemArray.map((data, indexRow) => (
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
                                                        <td key={index} className={`${column.class} ${column.minDevice == CommonConstants.DEVICE.DESKTOP ? "min-desktop" : column.minDevice == CommonConstants.DEVICE.TABLET ? "min-tablet" : ""}`} role={index === 0 ? "button" : null} onClick={index === 0 ? () => showDetail(indexRow) : null}>
                                                            {
                                                                index == 0 &&
                                                                <span className={`${detailRow[indexRow] ? "bi-dash-circle-fill" : "bi-plus-circle-fill"} text-primary me-2 ${columnAlwaysHide.length === 0 ? "max-desktop" : null}`} />
                                                            }
                                                            {
                                                                column.render != undefined
                                                                    ? column.render(getNestedValue(data, column.data), data)
                                                                    : getNestedValue(data, column.data) ?? (column.defaultContent ? column.defaultContent() : "")
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
                                                                <div key={index} className={`border-bottom mx-2 px-2 py-2 ${column.minDevice == CommonConstants.DEVICE.TABLET ? "max-tablet" : column.minDevice == CommonConstants.DEVICE.DESKTOP ? "max-desktop" : ""}`}>
                                                                    <label className="fw-bold me-2">{column.name}</label>
                                                                    {
                                                                        column.render != undefined
                                                                            ? column.render(getNestedValue(data, column.data), data)
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
                CommonConstants.TABLE.PAGINATION === type
                && dataTotal > 0
                && <div>
                    <div className="float-sm-start d-grid d-sm-flex mt-2">
                        {t
                            (
                                "datatable.text.info",
                                {
                                    start: ((currentPage - 1) * sizePage + 1) > dataTotal > 0 ? 0 : (((currentPage - 1) * sizePage) + 1),
                                    end: ((currentPage - 1) * sizePage + 1) > dataTotal > 0 ? 0 : (currentPage * sizePage > dataTotal ? dataTotal : (currentPage * sizePage)),
                                    total: dataTotal
                                }
                            )
                        }
                    </div>
                    <div className="float-sm-end d-grid d-sm-flex mt-2">
                        {
                            pages.length > 1
                            && <ul className="pagination">
                                <li className="page-item d-none d-sm-block">
                                    {
                                        currentPage === 1
                                            ? <a className="page-link disabled">{t("datatable.text.previous")}</a>
                                            : <a className="page-link" onClick={() => onPageChange(currentPage - 1, sizePage, search)} role="button">
                                                {t("datatable.text.previous")}
                                            </a>
                                    }
                                </li>
                                {
                                    paginationButton(currentPage, pages.length, limitPaginationButton).map((page, index) => (
                                        <li
                                            key={index}
                                            className={
                                                page === currentPage ? "page-item active" : "page-item"
                                            }
                                        >
                                            {
                                                page === currentPage || page === "..."
                                                    ? <a className="page-link">{page}</a>
                                                    : <a className="page-link" onClick={() => onPageChange(page, sizePage, search)} role="button">
                                                        {page}
                                                    </a>
                                            }
                                        </li>
                                    ))
                                }
                                <li className="page-item d-none d-sm-block">
                                    {
                                        currentPage === pages.length
                                            ? <a className="page-link disabled">{t("datatable.text.next")}</a>
                                            : <a className="page-link" onClick={() => onPageChange(currentPage + 1, sizePage, search)} role="button">
                                                {t("datatable.text.next")}
                                            </a>
                                    }
                                </li>
                            </ul>
                        }
                    </div>
                </div>
            }
            {
                CommonConstants.TABLE.LOAD_MORE === type
                && itemArray.length > 0
                && <Fragment>
                    <div className="mt-2">
                        {t("common.text.amountItem", { amount: itemArray.length })}
                    </div>
                    {
                        loadMoreButtonFlag
                        && <div className="text-center mt-2">
                            <button className="btn btn-md btn-primary rounded border-0 shadow-sm" disabled={loadingFlag} type="button" onClick={() => onPageLoadMore(currentPage + 1, sizePage, search)}>
                                <span className={loadingFlag ? "spinner-border spinner-border-sm mx-2" : null} role="status" aria-hidden="true" />
                                <span className="bi-arrow-down-circle">&nbsp;&nbsp;{t("common.button.loadMore")}</span>
                            </button>
                        </div>
                    }
                </Fragment>
            }
        </div>
    )
}
import { useEffect, useRef, useState } from 'react';
import { Fragment } from 'react';
import './table.css';
import * as CommonConstants from "../constants/commonConstants";

export default function Table({
    labelNewButton
    , onNewButtonClick = () => { alert("Please define your function!") }
    , bulkOptionLoadingFlag = false
    , bulkOptionArray
    , dataArray = []
    , columns
    , order = []
    , checkBoxArray
    , onCheckBox = () => { alert("Please define your function!") }
    , dataTotal = 0
    , initialSizePage = 10
    , limitPaginationButton = 7
    , filter
    , onRender
    , loadingFlag = false
}) {
    const checkBoxStateArray = dataArray.map(function (obj) {
        return obj['id'];
    });

    const columnShow = columns.filter(column => { return column.minDevice !== CommonConstants.NONE; });
    const columnHide = columns.filter(column => { return column.minDevice !== undefined && column.minDevice !== CommonConstants.MOBILE; });
    const columnAlwaysHide = columns.filter(column => { return column.minDevice === CommonConstants.NONE; });

    const [search, setSearch] = useState("");
    const [currentOrder, setCurrentOrder] = useState(order);
    const [orderColumn, setOrderColumn] = useState([]);
    const [detailRow, setDetailRow] = useState(dataArray.map(() => false));

    const [currentPage, setCurrentPage] = useState(1);
    const [sizePage, setSizePage] = useState(initialSizePage);

    const pages = Array.from({ length: Math.ceil(dataTotal / sizePage) }, (_, i) => i + 1);
    const lengthArray = [5, 10, 25, 50, 100];

    useEffect(() => {
        if (orderColumn.length === 0) {
            var array = new Array();
            for (var i = 0; i < columnShow.length; i++) {
                array.push(columnShow[i].orderable ? "bi-three-dots-vertical" : null);
            }

            if (order.length > 0) {
                for (var i = 0; i < order.length; i++) {
                    if ("asc" === order[i][1]) {
                        array[order[i][0]] = "bi-sort-down-alt";
                        setCurrentOrder([columnShow[order[i][0]]["data"], "asc"]);
                        onRender(currentPage, sizePage, search, [columnShow[order[i][0]]["data"], "asc"]);
                        break;
                    } else if ("desc" === order[i][1]) {
                        array[order[i][0]] = "bi-sort-down";
                        setCurrentOrder([columnShow[order[i][0]]["data"], "desc"]);
                        onRender(currentPage, sizePage, search, [columnShow[order[i][0]]["data"], "desc"]);
                        break;
                    }
                }
            } else {
                onRender(currentPage, sizePage, search);
            }
            setOrderColumn(array);
        } else {
            onPageChange(1, sizePage, search)
        }
    }, [filter]);

    const onPageChange = (page, length, search) => {
        setCurrentPage(page);
        setSizePage(length);
        setDetailRow(dataArray.map(() => false));
        onRender(page, length, search, currentOrder);
    };

    const onOrderChange = (data, index) => {
        var array = new Array();
        for (var i = 0; i < orderColumn.length; i++) {
            if (index === i) {
                setDetailRow(dataArray.map(() => false));
                if (orderColumn[i] === "bi-sort-down") {
                    array.push("bi-sort-down-alt");
                    setCurrentOrder([data, "asc"]);
                    onRender(currentPage, sizePage, search, [data, "asc"]);
                } else {
                    array.push("bi-sort-down");
                    setCurrentOrder([data, "desc"]);
                    onRender(currentPage, sizePage, search, [data, "desc"]);
                }
            } else {
                array.push(orderColumn[i] !== null ? "bi-three-dots-vertical" : null);
            }
        }
        setOrderColumn(array);
    };

    const onCheckBoxAll = () => {
        const currentCheckBoxStateArray = checkBoxStateArray.length;
        const currentCheckBoxArray = dataArray.filter(datum => checkBoxArray.includes(datum.id)).length;
        dataArray.forEach(function (dataArray) {
            if (currentCheckBoxStateArray !== currentCheckBoxArray) {
                if (checkBoxArray.includes(dataArray.id) === false) {
                    checkBoxArray.push(dataArray.id);
                }
            } else {
                if (checkBoxArray.includes(dataArray.id)) {
                    checkBoxArray.splice(checkBoxArray.indexOf(dataArray.id), 1)
                }
            }
        });

        onCheckBox(checkBoxArray);
    };

    const onCheckBoxSingle = (id) => {
        if (checkBoxArray.includes(id)) {
            checkBoxArray.splice(checkBoxArray.indexOf(id), 1)
        } else {
            checkBoxArray.push(id);
        }

        onCheckBox(checkBoxArray);
    };

    const showDetail = (index) => {
        setDetailRow({ ...detailRow, [index]: !detailRow[index] });
    }

    const paginationRange = (len, start) => {
        var end;

        if (start === undefined) {
            start = 1;
            end = len;
        } else {
            end = start;
            start = len;
        }

        var out = [];
        for (var i = start; i <= end; i++) { out.push(i); }
        return out;
    }

    const paginationButton = (currentPage, pageAmount, limitButton) => {
        const halfLimitButon = Math.floor(limitButton / 2);
        var buttonArray;
        if (pageAmount <= limitButton) {
            buttonArray = paginationRange(1, pageAmount);
        } else if (currentPage <= halfLimitButon) {
            buttonArray = paginationRange(1, limitButton);
            buttonArray[limitButton - 2] = "...";
            buttonArray[limitButton - 1] = pageAmount;
        } else if (currentPage >= pageAmount - halfLimitButon) {
            buttonArray = paginationRange(pageAmount - limitButton + 1, pageAmount);
            buttonArray[0] = 1;
            buttonArray[1] = "...";
        } else {
            buttonArray = paginationRange(currentPage - halfLimitButon, currentPage + halfLimitButon);
            buttonArray[0] = 1;
            buttonArray[1] = "...";
            buttonArray[limitButton - 2] = "...";
            buttonArray[limitButton - 1] = pageAmount;
        }

        return buttonArray;
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
                                    <span className="bi-stack">&nbsp;{checkBoxArray?.length > 0 ? `(${checkBoxArray?.length}) ` : null}Bulk Option</span>
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
                    loadingFlag && <div className="spinner-border text-primary position-absolute top-50 start-50"></div>
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
                                ? dataArray.map((data, indexRow) => (
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
                                                        <td key={index} className={`${column.class} ${column.minDevice == CommonConstants.DESKTOP ? "min-desktop" : column.minDevice == CommonConstants.TABLET ? "min-tablet" : ""}`}>
                                                            {
                                                                index == 0 &&
                                                                <span className={`${detailRow[indexRow] ? "bi-dash-circle-fill" : "bi-plus-circle-fill"} text-primary me-2 ${columnAlwaysHide.length === 0 ? "max-desktop" : null}`} role="button" onClick={() => showDetail(indexRow)}></span>
                                                            }
                                                            {
                                                                column.render != undefined
                                                                    ? column.render(data[column.data], data)
                                                                    : data[column.data]
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
                                                                            : data[column.data]
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
                                        Data not founded.
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            {
                dataTotal > 0
                && <div>
                    <div className="float-sm-start d-grid d-sm-flex mt-2">
                        Showing {((currentPage - 1) * sizePage + 1) > dataTotal ? "0" : `${((currentPage - 1) * sizePage) + 1} to ${currentPage * sizePage > dataTotal ? dataTotal : currentPage * sizePage}`} of {dataTotal} entries
                    </div>
                    <div className="float-sm-end d-grid d-sm-flex mt-2">
                        {
                            pages.length > 1
                            && <ul className="pagination">
                                <li className="page-item d-none d-sm-block">
                                    {
                                        currentPage === 1
                                            ? <a className="page-link disabled">Previous</a>
                                            : <a className="page-link" onClick={() => onPageChange(currentPage - 1, sizePage, search)} role="button">
                                                Previous
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
                                            ? <a className="page-link disabled">Next</a>
                                            : <a className="page-link" onClick={() => onPageChange(currentPage + 1, sizePage, search)} role="button">
                                                Next
                                            </a>
                                    }
                                </li>
                            </ul>
                        }
                    </div>
                </div>
            }
        </>
    );
}
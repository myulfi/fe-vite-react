import { useState } from 'react';
import './table.css';

export default function Table({
    labelNewButton
    , onNewButtonClick = () => { alert("Please define your function!") }
    , bulkOptionLoadingFlag = false
    , bulkOptionArray
    , dataArray = []
    , columns
    , checkBoxArray
    , onCheckBox = () => { alert("Please define your function!") }
    , dataTotal = 0
    , limitPaginationButton = 7
    , onRender
    , loadingFlag = false
}) {
    const checkBoxStateArray = dataArray.map(function (obj) {
        return obj['id'];
    });

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sizePage, setSizePage] = useState(5);

    const pages = Array.from({ length: Math.ceil(dataTotal / sizePage) }, (_, i) => i + 1);
    const lengthArray = [5, 10, 25, 50, 100];

    const onPageChange = (page, length, search) => {
        setCurrentPage(page);
        setSizePage(length);
        onRender(page, length, search);
    };

    const onCheckBoxAll = event => {
        dataArray.forEach(function (dataArray) {
            if (event.target.checked) {
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
                                    <input
                                        type="checkbox"
                                        id="checkall"
                                        checked={checkBoxStateArray.length > 0 && checkBoxStateArray.every(id => new Set(checkBoxArray).has(id))}
                                        onChange={onCheckBoxAll}
                                    />
                                </th>
                            }
                            {
                                columns.map((column, index) => (
                                    <th key={index} scope="col" className={column.class} width={`${column.width}%`}>{column.name}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataArray.length > 0
                                ? dataArray.map((data) => (
                                    <tr key={data.id}>
                                        {
                                            checkBoxArray != undefined
                                            && <td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={checkBoxArray.indexOf(data.id) >= 0}
                                                    onChange={() => onCheckBoxSingle(data.id)}
                                                />
                                            </td>
                                        }
                                        {
                                            columns.map((column, index) => (
                                                <td key={index} className={column.class}>
                                                    {
                                                        column.render != undefined
                                                            ? column.render(data[column.data])
                                                            : data[column.data]
                                                    }
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                                : <tr>
                                    <td colSpan={columns.length + (checkBoxArray != undefined ? 1 : 0)} className="text-center">
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
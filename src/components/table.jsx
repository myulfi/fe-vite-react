import { useState } from 'react';

export default function Table({
    labelNewButton
    , onClickNewButton = () => { alert("Please define your function!") }
    , bulkOptionArray
    , isBulkOptionLoading = false
    , dataArray = []
    , columns
    , checkBoxArray
    , onCheckBox = () => { alert("Please define your function!") }
    , dataTotal = 0
    , onRender
}) {
    const checkBoxStateArray = dataArray.map(function (obj) {
        return obj['id'];
    });

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sizePage, setSizePage] = useState(5);

    const pagesCount = Math.ceil(dataTotal / sizePage);
    const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
    const lengthArray = [5, 10, 25, 50, 100];
    const onSearchKeyDown = event => setSearch((event.target.value));

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

    return (
        <>
            <div>
                {/* <div className="clearfix">
                    <div className="float-none">
                        <div className="left-section">[{checkBoxArray.length}] checked</div>
                    </div>
                </div> */}
                <div className="clearfix">
                    <div className="float-start">
                        {
                            labelNewButton != undefined
                            && <button className="btn btn-md btn-primary rounded mb-3 border-0 shadow-sm" type="button" onClick={() => onClickNewButton()}>
                                <span className="bi-plus-circle">&nbsp;{labelNewButton}</span>
                            </button>
                        }
                    </div>
                    <div className="float-end">
                        {
                            bulkOptionArray !== undefined && bulkOptionArray.length > 0
                            && <div className="btn-group">
                                <button className="btn btn-outline-dark mb-3 shadow-sm dropdown-toggle" disabled={isBulkOptionLoading ? "disabled" : ""} data-bs-toggle="dropdown">
                                    <span className={isBulkOptionLoading ? "spinner-border spinner-border-sm mx-2" : ""} role="status" aria-hidden="true" />
                                    <span className="bi-stack">&nbsp;Bulk Option</span>
                                </button>
                                <div className="dropdown-menu">
                                    {
                                        bulkOptionArray.map((bulkOption, index) => (
                                            <a key={index} className="dropdown-item" onClick={bulkOption.onClick} role="button">
                                                <span className="bi-trash">&nbsp;{bulkOption.name}</span>
                                            </a>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="clearfix">
                    <div className="float-start">
                        Show <select className="p-1" value={sizePage} onChange={(e) => onPageChange(currentPage, e.target.value, search)}>
                            {
                                lengthArray.map((length) => (
                                    <option value={length} key={length}>{length}</option>
                                ))
                            }
                        </select> entires
                    </div>
                    <div className="float-end">
                        <input
                            type="text"
                            value={search}
                            placeholder="Search"
                            onChange={event => onSearchKeyDown(event)}
                            onKeyDown={event => { if (event.key === "Enter") { onPageChange(1, sizePage, search) } }}
                        />
                    </div>
                </div>
            </div>
            <table className="table table-bordered mt-3 align-middle">
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
                                <th key={index} scope="col" className={column.class}>{column.name}</th>
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
                                    {/* <td className="text-center">
                                        <Link to={`/example-template/edit/${data.id}`} className="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">Edit</Link>
                                        <ButtonTable
                                            label="Delete"
                                            onClick={() => deleteExampleTemplate(data.id)}
                                            buttonClass="btn btn-sm btn-danger rounded-sm shadow border-0 me-2"
                                        isLoading={optionRow[data.id] !== undefined && optionRow[data.id].deletedButtonFlag}
                                        />
                                    </td> */}
                                </tr>
                            ))

                            : <tr>
                                <td colSpan={columns.length + 1} className="text-center">
                                    Data not founded.
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
            {
                dataTotal > 0
                && <div>
                    <div className="float-start">
                        Showing {((currentPage - 1) * sizePage + 1) > dataTotal ? "0" : `${((currentPage - 1) * sizePage) + 1} to ${currentPage * sizePage > dataTotal ? dataTotal : currentPage * sizePage}`} of {dataTotal} entries
                    </div>
                    <div className="float-end">
                        {
                            pages.length > 1
                            && <ul className="pagination">
                                {
                                    pages.map((page) => (
                                        <li
                                            key={page}
                                            className={
                                                page === currentPage ? "page-item active" : "page-item"
                                            }
                                        >
                                            {
                                                page === currentPage
                                                    ? <a className="page-link">{page}</a>
                                                    : <a className="page-link" onClick={() => onPageChange(page, sizePage, search)} role="button">
                                                        {page}
                                                    </a>
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                    </div>
                </div>
            }
        </>
    );
}
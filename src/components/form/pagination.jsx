export default function Pagination({
    search
    , dataTotal
    , currentPage
    , sizePage
    , onSearchKeyDown
    , onPageChange
}) {
    const pagesCount = Math.ceil(dataTotal / sizePage);
    const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
    const lengthArray = [5, 10, 25, 50, 100];
    return (
        <div>
            Showing {((currentPage - 1) * sizePage + 1) > dataTotal ? "0" : `${((currentPage - 1) * sizePage) + 1} to ${currentPage * sizePage > dataTotal ? dataTotal : currentPage * sizePage}`} of {dataTotal} entries
            <ul className="Pagination"></ul>
            {
                pages.map((page) => (
                    <li
                        key={page}
                        className={
                            page === currentPage ? "pageItemActive" : "pageItem"
                        }
                    >
                        {
                            page === currentPage
                                ? page
                                : <a className="pageLink" onClick={() => onPageChange(page, sizePage, search)}>
                                    {page}
                                </a>
                        }
                    </li>
                ))
            }

            <select value={sizePage} onChange={(e) => onPageChange(currentPage, e.target.value, search)}>
                {
                    lengthArray.map((length) => (
                        <option value={length} key={length}>{length}</option>
                    ))
                }
            </select>

            <input
                type="text"
                value={search}
                placeholder="Search"
                onChange={event => onSearchKeyDown(event)}
                onKeyDown={event => { if (event.key === "Enter") { onPageChange(currentPage, sizePage, search) } }}
            />
        </ div >
    );
}
import React from 'react';
import { useHistory } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

const Paginator = ({span=2, domain, currentPage, totalPages, perPage}) => {
    const history = useHistory();
    const Action = (number) => {
        history.push(`${domain}?page=${number}&per_page=${perPage}`)
    }

    const paginationItems = [];
    for (let pageNum = Math.max(1, currentPage - span); pageNum <= Math.min(totalPages, currentPage + span); pageNum++) {
        paginationItems.push(
            <Pagination.Item key={pageNum} active={currentPage === pageNum} onClick={() => Action(pageNum)}>
                {pageNum}
            </Pagination.Item>
        )
    }

    return (
        <Pagination style={{justifyContent: "center"}}>
            <Pagination.First disabled={currentPage === 1} onClick={() => Action(1)}/>
            <Pagination.Prev disabled={currentPage === 1} onClick={() => Action(currentPage - 1)}/>
            {currentPage > 1 + span &&
                <>
                <Pagination.Item onClick={() => Action(1)}>{1}</Pagination.Item>
                <Pagination.Ellipsis />
                </>
            }
            {paginationItems}
            {currentPage < totalPages - span &&
                <>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => Action(totalPages)}>{totalPages}</Pagination.Item>
                </>
            }
            <Pagination.Next disabled={currentPage === totalPages} onClick={() => Action(currentPage + 1)}/>
            <Pagination.Last disabled={currentPage === totalPages} onClick={() => Action(totalPages)}/>
        </Pagination>
    )
}

export default Paginator;
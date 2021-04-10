import React from 'react';
import { useHistory } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

const SPAN = 2;


const Paginator = ({domain, currentPage, totalPages, perPage}) => {
    const history = useHistory();
    const Action = (number) => {
        //console.log(number)
        history.push(`${domain}?page=${number}&per_page=${perPage}`)
    }

    const paginationItems = [];
    for (let pageNum = Math.max(1, currentPage - SPAN); pageNum <= Math.min(totalPages, currentPage + SPAN); pageNum++) {
        paginationItems.push(
            <Pagination.Item key={pageNum} active={currentPage === pageNum} onClick={() => Action(pageNum)}>
                {pageNum}
            </Pagination.Item>
        )
    }

    return (
        <Pagination>
            <Pagination.First disabled={currentPage === 1} onClick={() => Action(1)}/>
            <Pagination.Prev disabled={currentPage === 1} onClick={() => Action(currentPage - 1)}/>
            {currentPage > 1 + SPAN &&
                <>
                <Pagination.Item onClick={() => Action(1)}>{1}</Pagination.Item>
                <Pagination.Ellipsis />
                </>
            }
            {paginationItems}
            {currentPage < totalPages - SPAN &&
                <>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => Action(totalPages)}>{totalPages}</Pagination.Item>
                </>
            }
            <Pagination.Next onClick={() => Action(currentPage + 1)}/>
            <Pagination.Last onClick={() => Action(totalPages)}/>
        </Pagination>
    )
}

export default Paginator;